#!/usr/bin/env python3
"""
Convert a BrokerMetrics / SFAR MLS history export (.xlsx or .csv) into the
canonical CSV the geocode pipeline reads. Drops the output in data/raw/.

Usage:
    python3 scripts/convert-mls-history.py [--sold-only] <input.xlsx|.csv> [output-name.csv]

Example:
    python3 scripts/convert-mls-history.py ~/Downloads/2026MLSSFHistory.xlsx closed_2026.csv
    python3 scripts/convert-mls-history.py --sold-only ~/Downloads/1078442_RESI_E04A.csv sold_2026_a.csv

Then run:  node scripts/geocode-listings.mjs

The source export uses these columns (we match by name, tolerant of a few
aliases). Mapping notes:
  - Address is built from "Street Number Name Direction" + City + ZIP.
  - Listing Date is derived as Close Date - DOM, so the pipeline's days-on-market
    reproduces the export's DOM (the export has no list-date column).
  - Latitude/Longitude are passed through (any of Latitude / Lat / RTE Latitude),
    so the geocode step skips the Census round-trip.
  - Subdistrict -> Neighborhood ; Area/District -> Area Desc (district).
  - SqFt of 0/blank is written blank (treated as "unknown").
  - --sold-only drops any row whose Status isn't sold ("S" / "Closed" /
    "Sold Off MLS") and normalizes the surviving Status to "Closed" so the
    app's SOLD_STATUSES filter recognizes them.
"""
import sys, os, csv, datetime

CANON = ["Listing Number", "Status", "Status Date", "Property Subtype 1 Display",
         "Address", "City", "State", "Address - ZIP", "Latitude", "Longitude",
         "Neighborhood", "Area Desc", "APN", "Bedrooms", "Bathrooms Display",
         "Square Footage", "Listing Price", "Selling Price", "Listing Date",
         "Pending Date", "Selling Date", "Listing Agent Name", "Selling Agent Name",
         "DOM", "Full Picture URL"]

# app field -> candidate source column names (first present wins). Aliases are
# added over time as new MLS exports arrive with different column labels.
SRC = {
    "id": ["Listing #", "Listing Number", "ML Number", "ML Number Display", "MLS Number"],
    "status": ["Status"],
    "statusDate": ["Status Date"],
    "subtype": ["Property Subtype", "Property Subtype 1 Display", "Property Type"],
    "street": ["Street Number Name Direction", "Street Number Name Dir", "Address"],
    "city": ["City"],
    "zip": ["ZIP Code", "Address - ZIP", "Zip", "Postal Code"],
    "lat": ["Latitude", "Lat", "RTE Latitude"],
    "lng": ["Longitude", "Lng", "Long", "RTE Longitude"],
    "neighborhood": ["Subdistrict", "Neighborhood"],
    "district": ["Area/District", "Area Desc", "District"],
    "apn": ["APN", "Parcel Number"],
    "bd": ["BD", "Bedrooms"],
    "ba": ["BA", "Bathrooms Display", "Bathrooms"],
    "sqft": ["SqFt", "Square Footage", "Living Area"],
    "listPrice": ["Listing Price", "List Price"],
    "salePrice": ["Close Price", "Selling Price", "Sold Price", "Curr Selling Price"],
    "pendingDate": ["Pending Date", "Contract Date", "Contingent Date"],
    "closeDate": ["Close Date", "Selling Date", "Closed Date"],
    "dom": ["DOM", "Days on Market", "CDOM"],
    "agent": ["Agent Name", "Listing Agent Name", "Agent Full Name"],
    "sellingAgent": ["Selling Agent Name", "Selling Agent", "Selling Agent Full Name", "Buyer Agent Name", "Buyer Agent"],
    "photo": ["Full Picture URL", "Photo URL", "Photo", "Picture URL"],
}

# Statuses that count as "sold" for --sold-only, matching the app's
# SOLD_STATUSES set in app/listings/lib/filter.js. All are normalized to
# "Closed" on write so the two shortcuts ("S" from BrokerMetrics,
# "Closed" from SFAR) unify.
SOLD_STATUSES = {"S", "SOLD", "CLOSED", "SOLD OFF MLS", "CLS", "CLOSD"}
def is_sold(status):
    return str(status or "").strip().upper() in SOLD_STATUSES

# Property-subtype code translation. Some MLS exports emit 4-letter codes
# (BrokerMetrics: HSL1/CNDO/TWNH/…) instead of the display names the app's
# filter chips key off. Map codes → full names so both export flavors flow
# through unchanged. Anything not in the map passes through as-is.
SUBTYPE_CODES = {
    "HSL1": "Single Family Residence",
    "HSL2": "2 Houses on Lot",
    "HSL3": "3+ Houses on Lot",
    "CNDO": "Condominium",
    "TCLA": "Tenancy in Common",
    "TIC":  "Tenancy in Common",
    "TWNH": "Townhouse",
    "COOP": "Stock Cooperative",
    "HALF": "Halfplex",
    "COOW": "Co-Ownership",
    "LOFT": "Loft",
    "OTHR": "Other",
}
def normalize_subtype(s):
    key = str(s or "").strip().upper()
    return SUBTYPE_CODES.get(key, s)


def read_rows(path):
    """Return (header list, list-of-row-tuples) from .xlsx or .csv."""
    if path.lower().endswith((".xlsx", ".xlsm")):
        import openpyxl
        wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
        ws = wb[wb.sheetnames[0]]
        rows = list(ws.iter_rows(values_only=True))
        return list(rows[0]), rows[1:]
    with open(path, newline="") as f:
        rows = list(csv.reader(f))
    return rows[0], rows[1:]


def as_date(v):
    if isinstance(v, (datetime.datetime, datetime.date)):
        return datetime.date(v.year, v.month, v.day)
    try:
        return datetime.datetime.strptime(str(v)[:10], "%Y-%m-%d").date()
    except Exception:
        try:
            return datetime.datetime.strptime(str(v)[:8], "%m/%d/%y").date()
        except Exception:
            return None


def mdy(v):
    d = as_date(v)
    return d.strftime("%m/%d/%y") if d else ""


def as_coord(v):
    """Latitude/longitude pass-through. Some MLS feeds (MLSListings rows in
    a BrokerMetrics export) emit 0.000000 for listings they never geocoded;
    treat 0/blank/non-numeric as missing so the geocoder's Census fallback
    fills them in instead of mapping the listing to the Gulf of Guinea."""
    if v is None or v == "":
        return ""
    try:
        f = float(str(v).strip())
    except (TypeError, ValueError):
        return ""
    return "" if f == 0 or f != f else v  # 0 or NaN → missing


def as_num(v):
    """CSV cells arrive as strings; xlsx cells as ints/floats. Return an int
    if the value cleanly parses to a positive number, else None."""
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return int(v) if v > 0 else None
    s = str(v).strip().replace(",", "")
    try:
        f = float(s)
        return int(f) if f > 0 else None
    except (TypeError, ValueError):
        return None


def main():
    args = sys.argv[1:]
    sold_only = False
    if "--sold-only" in args:
        sold_only = True
        args = [a for a in args if a != "--sold-only"]
    if len(args) < 1:
        print(__doc__)
        sys.exit(1)
    inp = args[0]
    out_name = args[1] if len(args) > 1 else (
        os.path.splitext(os.path.basename(inp))[0] + ".csv")
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out = os.path.join(root, "data", "raw", out_name)

    header, data = read_rows(inp)
    idx = {name: i for i, name in enumerate(header)}

    def col(field):
        for name in SRC[field]:
            if name in idx:
                return idx[name]
        return None

    pos = {k: col(k) for k in SRC}
    missing = [k for k in ("id", "status", "salePrice", "closeDate") if pos[k] is None]
    if missing:
        print(f"WARNING: required source columns not found for: {missing}")

    def g(r, field):
        i = pos[field]
        if i is None or i >= len(r):
            return ""
        v = r[i]
        return "" if v is None else v

    n = 0
    dropped_non_sold = 0
    with open(out, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(CANON)
        for r in data:
            raw_status = g(r, "status")
            if sold_only and not is_sold(raw_status):
                dropped_non_sold += 1
                continue
            # Normalize "S" and other sold shorthand to "Closed" so the
            # app's SOLD_STATUSES set matches.
            status_out = "Closed" if sold_only or is_sold(raw_status) else raw_status
            close = as_date(g(r, "closeDate"))
            dom_num = as_num(g(r, "dom"))
            list_date = ""
            if close and dom_num is not None:
                list_date = (close - datetime.timedelta(days=int(dom_num))).strftime("%m/%d/%y")
            sqft_out = as_num(g(r, "sqft")) or ""
            zip5 = str(g(r, "zip")).split("-")[0].split(".")[0][:5]
            street = str(g(r, "street")).strip()
            city = str(g(r, "city")).strip() or "San Francisco"
            address = f"{street}, {city}, CA {zip5}" if street else ""
            # Photo comes as a semicolon-list from the MLS; the geocoder takes
            # only the first URL, so pass through as-is.
            photo = str(g(r, "photo") or "").strip()
            w.writerow([
                g(r, "id"), status_out, mdy(g(r, "statusDate")), normalize_subtype(g(r, "subtype")),
                address, city, "CA", zip5, as_coord(g(r, "lat")), as_coord(g(r, "lng")),
                g(r, "neighborhood"), g(r, "district"), g(r, "apn"),
                g(r, "bd"), g(r, "ba"), sqft_out,
                g(r, "listPrice"), g(r, "salePrice"), list_date,
                mdy(g(r, "pendingDate")), mdy(g(r, "closeDate")), g(r, "agent"),
                g(r, "sellingAgent"),
                (int(dom_num) if dom_num is not None else ""),
                photo,
            ])
            n += 1
    tail = f" ({dropped_non_sold} non-sold dropped)" if sold_only else ""
    print(f"✓ wrote {out} ({n} rows{tail})")
    print("Next: node scripts/geocode-listings.mjs")


if __name__ == "__main__":
    main()

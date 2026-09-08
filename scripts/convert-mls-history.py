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
  - --sold-only drops any row that isn't a sale and normalizes the survivors
    to the app's two sold statuses: S / Closed -> "Closed", O / Sold Off MLS
    -> "Sold Off MLS" (O rows are off-MLS sales: they carry a selling price
    and date but were never exposed as listings).
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

# Sold-status normalization, matching the app's SOLD_STATUSES set in
# app/listings/lib/filter.js ("Closed" / "Sold Off MLS"). Two export flavors:
# SFAR / BrokerMetrics history exports spell the status out; the RESI export
# uses one-letter codes — S = sold on the MLS, O = sold OFF the MLS (the row
# still carries a selling price + date; it's a real sale that was never
# exposed as a listing). "O" is only treated as a sale when the row has a
# selling price, so an export that uses O for withdrawn listings can't leak
# non-sales through.
SOLD_MAP = {
    "S": "Closed", "SOLD": "Closed", "CLOSED": "Closed", "CLS": "Closed", "CLOSD": "Closed",
    "O": "Sold Off MLS", "SOM": "Sold Off MLS", "SOLD OFF MLS": "Sold Off MLS", "OFF MLS": "Sold Off MLS",
}
def normalize_status(status, has_price=True):
    """Canonical sold status for a row, or None when it isn't a sale."""
    code = str(status or "").strip().upper()
    if code == "O" and not has_price:
        return None
    return SOLD_MAP.get(code)
def is_sold(status, has_price=True):
    return normalize_status(status, has_price) is not None

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

# Agent columns in some exports embed the agent's MLS ID and phone numbers:
#   "Jane Doe (ID:811150)  Primary:415-555-0100 Secondary:415-555-0101"
# The canonical CSV feeds a PUBLIC GeoJSON, so keep only the name. Split at
# the first "(ID:" or contact label; plain names pass through untouched.
import re
_AGENT_TAIL = re.compile(r"\s*\(ID:|\s+(?:Primary|Secondary|Cell|Other|Office|Home|Fax|Mobile|Direct|Phone)\s*:")
def clean_agent(s):
    return _AGENT_TAIL.split(str(s or ""), maxsplit=1)[0].strip()


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
            has_price = as_num(g(r, "salePrice")) is not None
            norm = normalize_status(raw_status, has_price)
            if sold_only and norm is None:
                dropped_non_sold += 1
                continue
            # Sold shorthand -> the app's canonical status ("Closed" or
            # "Sold Off MLS"); anything else passes through as exported.
            status_out = norm if norm is not None else raw_status
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
                mdy(g(r, "pendingDate")), mdy(g(r, "closeDate")), clean_agent(g(r, "agent")),
                clean_agent(g(r, "sellingAgent")),
                (int(dom_num) if dom_num is not None else ""),
                photo,
            ])
            n += 1
    tail = f" ({dropped_non_sold} non-sold dropped)" if sold_only else ""
    print(f"✓ wrote {out} ({n} rows{tail})")
    print("Next: node scripts/geocode-listings.mjs")


if __name__ == "__main__":
    main()

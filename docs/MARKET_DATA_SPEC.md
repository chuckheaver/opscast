# OpsCast Real-Estate Data Spec

One recurring MLS export drives **everything** — the `/listings` map and the
`/market` rolling reports (MoM, YoY, annual). This doc is the data contract:
what to export, how the columns map, how the 2-year rolling load works, and
how an API feed would change the workflow.

A ready-to-hand-off header template lives next to this file:
**`docs/mls-export-template.csv`**.

---

## 1. The 2-year rolling model

You want ~2 years on hand: a **2025 baseline + 2026 accumulating**, so the app
can do MoM, YoY, and annual.

- **Closed sales are final.** A 2025 closing never changes — export the full
  2025 year **once**, drop it in, done.
- **Active / Pending change constantly.** Re-export those on whatever cadence
  you want the live numbers to reflect (weekly is plenty; monthly is the floor).
- **The loader merges every CSV in `data/raw/`** and de-dupes by **Listing
  Number**. When the same listing appears in two files, the record with the
  **most recent Status Date wins**, so status changes (Active → Pending →
  Closed) propagate as you add newer exports.
- **Reporting periods fall out automatically:**
  - **MoM** = selected month vs. prior month
  - **YoY** = selected month vs. same month last year (needs the 2025 baseline)
  - **Annual** = full 2025 vs. full 2026 (or trailing-12 vs. prior-12)

**Practical cadence:** load `closed_2025.csv` once; refresh a rolling
`current.csv` (all of 2026 + open listings) weekly or monthly. Two files, that's it.

---

## 2. Column mapping

The loader matches each field against a list of **common column names**, so you
don't have to rename your export — just include the data. (It already does this
for square footage.) Below: the app field, what it powers, and the column names
we look for. **Bold = required.**

### Core — powers the stats already live

| App field | Powers | Accepted column names |
|---|---|---|
| **Listing Number** | unique id, de-dupe, Realtor.com link | `Listing Number`, `ML Number Display`, `MLS Number`, `ML#` |
| **Status** | Active/Pending/Closed segmentation | `Status` |
| **Property Subtype** | SFH vs Condo/TIC/Coop; type filter | `Property Subtype 1 Display`, `Property Subtype Desc`, `Property Type` |
| **List Price** | %Ask, % over list, % of list received | `Listing Price`, `List Price` |
| **Sale Price** | medians, $/sqft | `Selling Price`, `Close Price`, `Sold Price` |
| **List Date** | days on market | `Listing Date`, `List Date` |
| **Close / Sold Date** | period bucketing (the backbone), DOM | `Selling Date`, `Close Date`, `Closed Date` |
| **Address** | display, geocode fallback | `Address`, `Street Address` |
| **ZIP** | geocode, grouping | `Address - ZIP`, `Zip`, `Postal Code` |
| Status Date | which record wins on de-dupe | `Status Date` |

### New fields you said you can get — drop the placeholders, improve accuracy

| App field | Powers | Accepted column names |
|---|---|---|
| **Square Footage** (living area) | **$/Sq Ft** (overall + per neighborhood) | `Square Footage`, `Living Area`, `Living Square Feet`, `SqFt`, `Approx Living SqFt`, `Building Area Total` |
| **Neighborhood** | neighborhood breakdown — authoritative, replaces the geocoded guess | `Neighborhood`, `Area`, `Subdivision Name` |
| **District** | district breakdown | `Area Desc`, `District`, `MLS Area`, `Realtor District` |
| $/Sq Ft (optional) | used directly if present; otherwise computed from Sale ÷ SqFt | `$/SqFt`, `Price Per Sq Ft`, `$ Per SqFt` |

> **$/SqFt vs SqFt:** prefer **square footage** — we compute $/sqft from it so
> the medians aggregate correctly (median of each home's $/sqft, not a ratio of
> two medians). If you can only get $/sqft, we'll use it, but sqft is better.

### Highly recommended — ask your MLS if these are available

| App field | Powers | Accepted column names |
|---|---|---|
| **Latitude / Longitude** | map pins + Fog Zone, and **eliminates address geocoding entirely** (fixes the ~48 downtown condos that don't geocode) | `Latitude`/`Longitude`, `Lat`/`Lng`, `Lat`/`Long`, `GeoLat`/`GeoLon` |
| **Contract / Pending Date** | "Went Into Contract" counts by month | `Pending Date`, `Contract Date`, `Under Contract Date`, `Contingent Date` |
| Bedrooms / Bathrooms | display, filters | `Bedrooms`; `Bathrooms Display` |
| APN | parcel id | `APN`, `Parcel Number` |
| Listing Agent / Office | display | `Listing Agent Name`; `Listing Office Name / ID` |

### For "# For Sale (month-end)" inventory — pick one approach

The hardest historical metric, because a *closed-sales* export doesn't contain
homes that sat active-but-unsold. Two ways to get it:

1. **Export every status** (Active, Pending, Contingent, Coming Soon, Closed,
   Withdrawn, Expired) **with an end date** — then the app reconstructs "active
   on date X." Needs: `List Date` + an **Off-Market / Withdrawn / Expired Date**
   (`Off Market Date`, `Withdrawn Date`, `Expiration Date`).
2. **Snapshot forward** — refresh the open-listings export weekly and let the app
   record month-end counts going forward. Simpler; builds history from today.

### Multi-unit (phase 2 — separate "Residential Income" export)

| App field | Powers | Accepted column names |
|---|---|---|
| Number of Units | price per unit | `Number of Units`, `Units` |
| Gross Scheduled Income / NOI | cap rate, GRM (or provide them directly) | `Gross Scheduled Income`, `Net Operating Income`, `Cap Rate`, `GRM` |

---

## 3. What each new field turns on

| Add this | Lights up |
|---|---|
| 12 months of closings (close date) | YoY + the full rolling-12 trend (currently "n/a") |
| Square Footage | $/Sq Ft in `/listings`, `/market`, and the popup |
| Latitude / Longitude | 100% map coverage (no geocode misses), accurate Fog Zone |
| Neighborhood + District | authoritative breakdowns (no polygon edge cases) |
| Contract / Pending Date | "Went Into Contract" |
| Inventory (option 1 or 2) | "# For Sale (month-end)" |

---

## 4. How API access changes the process

Today the pipeline is **manual CSV → `data/raw/` → build script → deploy**. It
works, but every refresh is a hand export.

A direct MLS **data feed** changes it from a manual snapshot to an automated,
always-current pull:

| | CSV export (today) | API feed |
|---|---|---|
| Refresh | manual, you re-export | scheduled job (daily/hourly), no hands |
| Update size | full re-pull each time | **incremental** — only records changed since last sync (via ModificationTimestamp) |
| Field names | vary by export tool (we alias them) | **standardized** (RESO Data Dictionary) |
| Coordinates | geocode addresses ourselves | lat/long included → no geocoding |
| Inventory & contract dates | need special exports | status history is queryable → "# For Sale" and "Went Into Contract" come for free |
| History backfill | one big CSV | one dated range query |

**What it would look like:** a small scheduled task pulls the feed, updates the
stored dataset (the same `sf-listings.geojson`, or a small database), and the
app reads it as it does now — the `/listings` and `/market` front-ends don't
change. "Real-time" becomes "as fresh as the cron interval."

**What you'd need:** an MLS data-license agreement plus a feed provider —
typically **MLS Grid, Bridge Interactive (Zillow Group), Spark/FBS, or
Trestle (CoreLogic)** — most now serve the **RESO Web API**. Note: **BrokerMetrics
is analytics on top of the MLS, not a raw feed** — for automated data you go
through the MLS's RESO Web API or one of those vendors. There's usually approval
and a fee, so the weekly-CSV path is the right bridge until that's in place.

---

## 5. TL;DR — what to put in the export

Hand whoever runs the MLS export the header template
(`docs/mls-export-template.csv`) and ask for:

1. **A full year of 2025 closings** (one-time baseline).
2. **All 2026 listings** (closed + active + pending), refreshed weekly/monthly.
3. Columns: the core set **plus Square Footage, Neighborhood, District, and —
   if available — Latitude/Longitude and Pending Date.**

Everything else is already handled, and each new column lights up its metric the
moment it appears.

// Content for /property-types. Kept as data so the page stays layout only.
//
// House style: facts only, one line each. If a reader wants the long
// version, that is a conversation, not a paragraph.
//
// Every SF-specific rule here was checked against city sources in Sept 2026:
// DBI (3R reports, Notices of Violation), SF Treasurer & Tax Collector
// (rates, installment dates, supplemental bills), SF Environment / SFPUC
// (RECO and water conservation), and the Capital Planning office's list of
// special finance districts. Figures move — the page says so.

// The five types side by side — the page opens on this table.
export const COMPARE = {
  cols: ["You own", "Loan", "Rate vs. a house", "Watch for"],
  rows: [
    { key: "sfh", name: "Single Family", cells: ["House + land", "Conventional or jumbo", "Best", "Unpermitted rooms"] },
    { key: "condo", name: "Condo", cells: ["Your unit + share of common areas", "Conventional — HOA must qualify", "Same, if warrantable", "HOA reserves, assessments"] },
    { key: "tic", name: "TIC", cells: ["% of the whole building", "Fractional TIC loan", "+0.25 to 1.0 pt", "Group loan vs. fractional"] },
    { key: "coop", name: "Co-op", cells: ["Shares + a lease", "Share loan (few lenders)", "Higher", "Board approval"] },
    { key: "multi", name: "Multi-Unit", cells: ["The building + tenancies", "2–4: residential · 5+: commercial", "Varies", "Legal unit count (3R)"] },
  ],
};

export const TYPES = [
  {
    key: "sfh",
    name: "Single Family",
    short: "One home, one lot, one owner.",
    what: "No shared walls, no board, no dues.",
    financing: [
      "Simplest loan — conventional, or jumbo above the county limit.",
      "Widest lender choice, usually the best rate.",
    ],
    watch: [
      "Pull the 3R: unpermitted rooms and garage conversions are common.",
      "Hillside lots: foundation and drainage.",
    ],
  },
  {
    key: "condo",
    name: "Condominium",
    short: "You own the unit; the HOA owns the rest.",
    what: "Own deed, own tax bill, monthly dues.",
    financing: [
      "The lender approves the HOA as well as you.",
      "Non-warrantable building = higher rate, bigger down payment.",
    ],
    watch: [
      "Read the reserve study, budget and last 2 years of minutes.",
      "An assessment voted after you close is yours to pay.",
    ],
  },
  {
    key: "tic",
    name: "Tenancy in Common (TIC)",
    short: "A share of the whole building, with one unit that is yours.",
    what: "One deed, one tax bill, split by the TIC agreement.",
    financing: [
      "Fractional loans: each owner has their own.",
      "About +0.25 to 1.0 pt over a condo; bigger down payment.",
    ],
    watch: [
      "A group loan ties you to every owner's payments.",
      "Trades 10–20% below a comparable condo.",
      "Condo conversion is a maybe, not a plan.",
    ],
  },
  {
    key: "coop",
    name: "Stock Cooperative",
    short: "Shares in a corporation, plus a lease to your unit.",
    what: "Rare in SF — a handful of older buildings.",
    financing: [
      "Share loan, not a mortgage — few lenders write them.",
      "Your monthly charge may include the building's own mortgage.",
    ],
    watch: [
      "The board must approve you — and can say no.",
      "Stricter rules on sublets, pets and renovation. Slower resale.",
    ],
  },
  {
    key: "multi",
    name: "Multi-Unit",
    short: "2–4 units is residential. 5+ is commercial.",
    what: "Tenants and their rents come with the building.",
    financing: [
      "2–4 units: residential loan; living in one can lower the down payment.",
      "5+ units: sized on the building's income, shorter terms.",
      "Below-market rents cut how much you can borrow.",
    ],
    watch: [
      "Legal unit count — see the 3R section.",
      "Get tenant estoppels; tenancies transfer to you.",
      "5+ wood-frame: check soft-story retrofit status.",
    ],
  },
];

// Each section: a one-line lead, then short facts. `h` is the fact; `p` is
// at most one supporting line.
export const SECTIONS = [
  {
    id: "financing",
    nav: "Financing Steps",
    kicker: "Before you tour",
    title: "Financing, step by step",
    lead: "Where you are in the process decides how seriously your offer is taken.",
    steps: [
      { h: "Pre-qualification", p: "A lender's estimate from what you tell them. Nothing checked — not offer-ready." },
      { h: "Pre-approval", p: "Credit pulled, documents reviewed, a letter. The minimum for an offer." },
      { h: "Underwritten approval", p: "An underwriter has cleared you; only the house is left. Closest thing to cash." },
      { h: "In contract", p: "Appraisal, title, conditions list, loan documents, signing, funding, recording." },
    ],
    body: [
      { h: "Bring", p: "2 years of tax returns and W-2s, recent pay stubs, 2 months of statements." },
      { h: "The property must qualify too", p: "Condo: HOA review. TIC: a fractional lender. 5+ units: commercial." },
      { h: "Jumbo is normal here", p: "Expect a larger down payment and cash reserves left after closing." },
      { h: "Rate lock", p: "Typically 30–60 days. Lock against the real closing date." },
      { h: "Change nothing until you have the keys", p: "No new credit, no job change, no unexplained deposits." },
    ],
  },
  {
    id: "units",
    nav: "3R & Unit Count",
    kicker: "Multi-unit: read this",
    title: "The 3R report and legal unit count",
    lead: "Never pay for a unit the city does not recognize.",
    body: [
      { h: "What it is", p: "DBI's record of permits and the legal number of units. About 7–10 business days." },
      { h: "What it is not", p: "Not an inspection or a guarantee — it reports what city records show." },
      { h: "Why it matters", p: "Illegal units: no appraisal credit, no loan, maybe no insurance, possible removal order." },
      { h: "Penalty", p: "Up to 9× the permit fee for unpermitted work, plus legalizing or removing it." },
      { h: "Do this", p: "Pull the 3R, walk the building against it, and price the legal count." },
    ],
  },
  {
    id: "disclosure",
    nav: "Disclosures",
    kicker: "Before contingencies come off",
    title: "The disclosure package",
    lead: "Often hundreds of pages. Read these first.",
    body: [
      { h: "State forms", p: "TDS, Seller Questionnaire, Natural Hazard report, lead paint (pre-1978)." },
      { h: "Property file", p: "Prelim title, 3R, pest and contractor inspections." },
      { h: "SF extras", p: "Energy/water compliance, soft-story status, rent-control disclosures, HOA package." },
      { h: "Read in this order", p: "HOA minutes and reserves → inspections → the rest. Every “unknown” is a question." },
      { h: "Get your own inspections", p: "Disclosures show what the seller knows — not what they don't." },
    ],
  },
  {
    id: "insurance",
    nav: "Insurance",
    kicker: "Week one of escrow",
    title: "Insurance",
    lead: "No policy, no loan. Get a quote while you can still walk away.",
    body: [
      { h: "Call an agent the day you're in contract", p: "Give year built, roof age, panel type and wiring." },
      { h: "The market", p: "Carriers are returning in 2026; premiums are still high." },
      { h: "Electrical panel", p: "Federal Pacific or Zinsco: most carriers require replacement." },
      { h: "Knob-and-tube wiring", p: "Common before the 1940s. Many carriers decline or add conditions." },
      { h: "Roof", p: "Under 3–5 years of life left gets flagged. Ask age, material, permit." },
      { h: "Earthquake is separate", p: "Not in a standard policy. Deductible is a % of the dwelling limit." },
      { h: "Ask for the CLUE report", p: "5 years of claims — old water claims are a common reason for a decline." },
    ],
  },
  {
    id: "taxes",
    nav: "Taxes",
    kicker: "What you'll really pay",
    title: "Property taxes",
    lead: "Your purchase price resets the tax base.",
    body: [
      { h: "Rate", p: "About 1.18% of purchase price in SF (1% base + voter-approved bonds)." },
      { h: "Growth", p: "Assessed value rises at most 2% a year while you own it (Prop 13)." },
      { h: "Due dates", p: "Nov 1 (late after Dec 10) and Feb 1 (late after Apr 10). No grace period." },
      { h: "Supplemental bill", p: "Arrives months after closing, not in your impound. Set cash aside." },
      { h: "TIC", p: "One bill for the building, split by the TIC agreement." },
    ],
  },
  {
    id: "districts",
    nav: "Mello-Roos",
    kicker: "Extra line items",
    title: "Mello-Roos and special districts",
    lead: "Special taxes sit on top of the base rate — and can rise every year.",
    body: [
      { h: "What it is", p: "A special tax that pays for local infrastructure. It's a lien on the property." },
      { h: "Where in SF", p: "Mostly new areas: Mission Bay, Transbay, Treasure Island, Mission Rock, Hunters Point, Central SoMa, Pier 70." },
      { h: "Other charges", p: "School parcel taxes and district assessments are per parcel — harder on small units." },
      { h: "Check three places", p: "The Natural Hazard report, the current tax bill, and the prelim title." },
      { h: "Ask", p: "How much, how fast it escalates, and the year it ends." },
    ],
  },
];

export const DISCLAIMER =
  "General information for San Francisco buyers and sellers, not legal, tax or lending advice. Figures current as of September 2026 — verify with DBI, the Treasurer & Tax Collector, your lender and your attorney or CPA.";

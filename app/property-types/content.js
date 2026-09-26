// Content for /property-types. Kept as data so the page stays layout only.
//
// Every SF-specific rule here was checked against city sources in Sept 2026:
// DBI (3R reports, Notices of Violation), SF Treasurer & Tax Collector
// (rates, installment dates, supplemental bills), SF Environment / SFPUC
// (RECO and water conservation), and the Capital Planning office's list of
// special finance districts. Figures move — the page says so and tells the
// reader to verify current terms.

export const TYPES = [
  {
    key: "sfh",
    name: "Single Family",
    short: "One home, one lot, one owner.",
    what:
      "You own the building and the land under it outright. No shared walls to negotiate, no board to answer to, no monthly dues. In San Francisco that usually means a detached house or a row house on its own parcel — and it is the smallest share of the market by count.",
    financing: [
      "The most straightforward loan of the five. Conventional financing, conforming up to the high-balance limit for San Francisco County, jumbo above it.",
      "No HOA for the lender to approve, so underwriting is about you and the appraisal rather than the building.",
      "Widest lender choice, which usually means the best rate of any type on this page.",
    ],
    watch: [
      "Check the 3R report anyway. A finished room down or a converted garage that never got a permit is extremely common here, and it becomes your problem at close.",
      "Deferred foundation and drainage work is the expensive surprise on hillside lots.",
    ],
  },
  {
    key: "condo",
    name: "Condominium",
    short: "You own the airspace; the HOA owns the rest.",
    what:
      "You hold title to your unit and an undivided interest in the common areas. A homeowners association owns and maintains the structure, roof, and grounds, and charges monthly dues to do it. This is real property with its own deed and its own tax bill.",
    financing: [
      "Financeable like a house, with one extra step: the lender underwrites the HOA as well as you.",
      "A “warrantable” building clears agency guidelines — enough owner-occupants, adequate reserves, no single owner holding too many units, dues delinquencies under control, no disqualifying litigation.",
      "A non-warrantable building falls to portfolio or jumbo lenders, at a higher rate and a larger down payment. This is a building problem, not a borrower problem, and it follows the unit to resale.",
    ],
    watch: [
      "Read the reserve study, the budget, the last two years of minutes, and any litigation disclosure before you remove contingencies.",
      "A special assessment voted in after you close is yours to pay. Minutes are where the warning usually is.",
      "Newer buildings may sit in a special tax district — see Special Districts below.",
    ],
  },
  {
    key: "tic",
    name: "Tenancy in Common (TIC)",
    short: "Co-ownership of a whole building, with exclusive rights to one unit.",
    what:
      "You and the other owners hold undivided percentage interests in one building on one deed. A recorded TIC agreement gives each owner exclusive use of a specific unit. It is not a condo, there is no separate parcel, and the whole building carries one property tax bill that the group apportions.",
    financing: [
      "Fractional financing is the norm now: each owner gets their own loan against their own percentage interest, underwritten and recorded separately, so one owner's default does not land on the others.",
      "Expect a rate premium over a comparable condo — commonly quoted between a quarter point and a full point — and a larger down payment. Fixed-for-life terms are rarer; adjustable structures are common.",
      "The lender pool is small. Ask early which banks are actively lending on TICs, because the list changes.",
    ],
    watch: [
      "An older building on a single group loan is a different and riskier animal than one on fractional loans — every owner's credit is tied to everyone else's payments. Know which one you are buying into.",
      "Read the TIC agreement on reserves, transfer rules, and what happens when an owner wants out.",
      "TICs trade at a discount to comparable condos, commonly in the ten-to-twenty-percent range. Some of that discount is the financing, and some of it is the resale pool being smaller.",
      "Condo conversion is not a given. Treat any future conversion as a possibility, not a plan.",
    ],
  },
  {
    key: "coop",
    name: "Stock Cooperative",
    short: "You own shares in a corporation, not real estate.",
    what:
      "The corporation owns the building. You buy shares allocated to a unit and receive a proprietary lease to occupy it. Rare in San Francisco and concentrated in a handful of older buildings.",
    financing: [
      "Not a mortgage. A share loan is secured by the stock and the lease, and only a few lenders write them.",
      "The building may carry its own underlying mortgage, and your monthly charge covers a share of it.",
      "Budget more time. Board approval is part of the deal, and boards can decline.",
    ],
    watch: [
      "Read the proprietary lease and the house rules as carefully as the financials — subletting, renovation, and pet rules are often stricter than a condo's.",
      "Resale is slower. The buyer pool is limited to people who can get a share loan and clear the board.",
    ],
  },
  {
    key: "multi",
    name: "Multi-Unit",
    short: "Two to four units, or five and up — and they are financed differently.",
    what:
      "Two-to-four-unit buildings are still residential for lending purposes. Five units and up is commercial. In a rent-controlled city the tenancies come with the building, so who is in place and on what terms is part of what you are buying.",
    financing: [
      "Two to four units: residential financing. If you occupy one unit you may qualify for a lower down payment, and a share of the market rent can help you qualify.",
      "Five or more units: commercial underwriting. The loan is sized on the building's income rather than your salary, with shorter terms, and often a balloon or a reset rather than thirty years fixed.",
      "Either way the appraisal leans on rents, so below-market rents cut your borrowing power directly.",
    ],
    watch: [
      "Legal unit count is the whole ballgame — see below.",
      "Existing tenancies, rent histories, and any pending petitions transfer to you. Ask for estoppels.",
      "A wood-frame building of five or more units may fall under the city's mandatory soft-story retrofit program. Confirm the status before you write.",
    ],
  },
];

export const SECTIONS = [
  {
    id: "financing",
    nav: "Financing Steps",
    kicker: "Before you look at a single house",
    title: "Financing, stage by stage",
    lead:
      "Every type above finances differently \u2014 but the process of getting the money is the same, and where you are in it decides how seriously your offer is taken.",
    body: [
      {
        h: "Pre-qualification is a conversation",
        p: "You tell a lender what you earn, what you owe and what you have saved. They do the arithmetic and give you a number, sometimes without pulling credit and almost always without seeing a document. It is useful for setting expectations and worth nothing in an offer, because nothing in it has been checked. Treat it as a starting point, not a credential.",
      },
      {
        h: "Pre-approval means someone verified it",
        p: "You complete an application, your credit is pulled, and you hand over the paperwork \u2014 two years of returns and W-2s, recent pay stubs, two months of bank and investment statements, and an explanation for anything unusual. The lender reviews it and issues a letter stating what you can borrow. This is what a listing agent expects to see attached to an offer, and an offer without one tends not to be counted.",
      },
      {
        h: "Fully underwritten approval is the one that wins",
        p: "A step further, and the one worth asking your lender for in this market. A human underwriter reviews your file and issues a credit approval with the property left blank \u2014 income, assets and credit already cleared, with only the house still to be determined. It is the closest thing to cash a financed buyer can carry, and it is what makes shortening a loan contingency defensible rather than reckless. It takes longer to get, so start before you are in contract, not after.",
      },
      {
        h: "What happens once you are in contract",
        p: "The file moves to the specific property. The lender orders an appraisal and title, sends disclosures on a clock, and underwriting issues a conditions list \u2014 almost always longer than you expect and almost always routine. You clear the conditions, the file goes back, and the lender issues loan documents. Signing is with a notary, funding follows, and in California the sale is final when the deed records, not when you sign.",
      },
      {
        h: "Where the property type re-enters",
        p: "Your approval is about you; the property still has to qualify on its own. A condo building has to clear the lender\u2019s HOA review. A TIC needs a lender who writes fractional loans at all. Five units or more is commercial underwriting on the building\u2019s income rather than your salary. Tell your lender which type you are shopping before you shop \u2014 an approval built for a single-family house does not automatically carry to a TIC.",
      },
      {
        h: "Jumbo is normal here",
        p: "With a median house above two million, most San Francisco purchases exceed the conforming limit and land in jumbo territory. Expect tighter underwriting, a larger down payment, and a reserves requirement \u2014 months of payments still in the bank after closing. Ask your lender what the reserve figure is early, because it is the part buyers most often fail to plan for.",
      },
      {
        h: "Rate locks",
        p: "A lock fixes your rate for a set window, typically thirty to sixty days, and a longer lock costs more. Locking too early on a slow escrow can mean paying to extend; locking too late leaves you exposed. Decide with your lender against the actual closing date rather than a default.",
      },
      {
        h: "Change nothing until you have the keys",
        p: "Between approval and funding, do not open a credit card, finance a car, change jobs, or move large sums between accounts without telling your lender first. Underwriting re-checks credit and employment before funding, and an unexplained deposit or a new debt can unwind an approval days before closing. If something has to change, say so early \u2014 it is almost always solvable in advance and almost never solvable at the end.",
      },
    ],
  },
  {
    id: "units",
    nav: "3R & Unit Count",
    kicker: "Multi-unit, read this twice",
    title: "The 3R Report and the legal unit count",
    lead:
      "The single most expensive mistake in San Francisco multi-unit buying is paying for a unit the city does not recognise.",
    body: [
      {
        h: "What a 3R report is",
        p: "A Report of Residential Building Record, issued by the Department of Building Inspection. It summarises the permit history for the property and states what DBI considers the number of legal dwelling units, based on what is in city records. Allow roughly seven to ten business days. On a mixed-use building it covers the residential permit history only.",
      },
      {
        h: "What it does not do",
        p: "It is not an inspection and it is not a guarantee. It reports what the records show — “insofar as ascertainable from City records” is the operative phrase. Records can be thin on older buildings. A 3R showing two units on a building being marketed as three is a stop sign; a clean 3R is a starting point, not an all-clear.",
      },
      {
        h: "Why the count matters so much",
        p: "An unpermitted unit is not income you can count on. Appraisers generally will not credit its rent, lenders will not underwrite on it, insurers may not cover it, and the city can order it removed. A three-unit price on a two-unit building is a real and recurring loss.",
      },
      {
        h: "What enforcement looks like",
        p: "DBI issues a Notice of Violation and the owner of record has to correct it — by legalising the work where that is possible, or by removing it. The standard penalty for work done without a permit is nine times the permit fee. The Board of Appeals can and does reduce that multiplier on appeal, with recent cases cut to four and five times. The dollar figure scales with the valuation of the work, so a small correction can run in the low thousands while a full unpermitted unit can reach five or six figures once drawings, permits, penalties and the construction itself are counted.",
      },
      {
        h: "What to do before you write",
        p: "Pull the 3R and compare it to what you are being shown. Walk every space against it. Where the marketing says three units and the record says two, price it as two and put the difference in writing. Ask whether legalisation has ever been attempted, and what happened.",
      },
    ],
  },
  {
    id: "disclosure",
    nav: "Disclosures",
    kicker: "Before you remove contingencies",
    title: "The disclosure package",
    lead:
      "San Francisco packages run long — several hundred pages is ordinary. Length is not the same as coverage.",
    body: [
      {
        h: "What is usually in it",
        p: "State forms — the Transfer Disclosure Statement, the Seller Property Questionnaire, a Natural Hazard Disclosure report, lead-based paint for anything pre-1978, and the Megan's Law notice. Then the property file: preliminary title report, the 3R report, pest and contractor inspections, and any reports the seller ordered.",
      },
      {
        h: "The San Francisco additions",
        p: "Energy and water conservation compliance under the city's residential ordinances — a certificate of completion has to be in hand before title transfers, and the work falls to the seller. Soft-story retrofit status on qualifying wood-frame buildings. For anything tenant-occupied, rent ordinance disclosures, rent histories and estoppels. For a condo, the full HOA package: CC&Rs, budget, reserve study, minutes, and litigation.",
      },
      {
        h: "How to actually read one",
        p: "Work backwards. Minutes and the reserve study before the glossy report. Pest and contractor findings before the photographs. Anything the seller marked “unknown” on the questionnaire is a question to ask, not a box that got ticked. And a disclosure package tells you what the seller knows — your own inspections tell you what they may not.",
      },
    ],
  },
  {
    id: "insurance",
    nav: "Insurance",
    kicker: "Do this in week one",
    title: "Insurance, and the three things that stop a policy",
    lead:
      "An uninsurable house is an unbuyable house. Your lender will not fund without a bound policy — so find out while you still have a contingency, not the week before closing.",
    body: [
      {
        h: "Call an agent the day you go into contract",
        p: "Not after the inspections, not once you have removed contingencies. Give them the address, the year built, the square footage, the roof age, the panel type and the wiring. A verbal indication comes back in about a day. If a carrier declines, or quotes three times what you budgeted, that is information you need while you can still act on it.",
      },
      {
        h: "What the California market looks like right now",
        p: "Hard, and only recently improving. Carriers pulled back sharply \u2014 State Farm non-renewed tens of thousands of California policies in 2024 and others left the state entirely \u2014 and the FAIR Plan, the insurer of last resort, roughly doubled to well over half a million homes. The Department of Insurance\u2019s Sustainable Insurance Strategy has since brought carriers back: several groups have committed to writing again, Farmers expanded in 2026, and FAIR Plan growth has slowed sharply. The honest summary for 2026 is that availability is recovering and price is not. Expect more choice than two years ago, at premiums that stay high.",
      },
      {
        h: "The electrical panel",
        p: "The first thing an underwriter looks for. Federal Pacific Stab-Lok and Zinsco panels \u2014 the latter sometimes branded Sylvania \u2014 have documented histories of breakers failing to trip or of heating at the bus connection. Most major carriers now require replacement before they will write or renew. If either name is on the panel door, budget for a replacement and price it into your offer rather than discovering it in escrow. Aluminum branch wiring from the 1960s and early 1970s draws the same scrutiny.",
      },
      {
        h: "Knob and tube wiring",
        p: "San Francisco\u2019s housing stock is overwhelmingly pre-war, and knob and tube was standard until roughly the 1940s. Plenty of it is still live behind the plaster. Some carriers decline any home that has it outright; others will write with a surcharge, conditions, and a deadline to remove it. \u201cPartially remediated\u201d is a phrase you will hear, and it is the insurer who decides whether that counts \u2014 not the seller and not the listing. Get the scope in writing, and have an electrician confirm what is actually still energised.",
      },
      {
        h: "The roof",
        p: "Age and remaining useful life. A roof with under three to five years left in it gets flagged, and some carriers will not bind at all until it is replaced. Ask for the age, the material, and any permit for the last replacement \u2014 which is also a line on the 3R report. On a flat roof, which is most of San Francisco, ask when it was last recoated as well.",
      },
      {
        h: "Earthquake is a separate policy",
        p: "A standard homeowners policy does not cover earthquake damage, and in this city that is not a footnote. Earthquake cover is bought separately, commonly through the California Earthquake Authority via a participating carrier. The deductible is a percentage of the dwelling limit rather than a flat figure, so on an expensive home it is a large number \u2014 run the arithmetic before you assume you are covered. Soft-story status and any completed retrofit affect both eligibility and price.",
      },
      {
        h: "What changes by ownership type",
        p: "On a condo the HOA\u2019s master policy covers the building and you buy an HO-6 for the interior, your contents and your liability \u2014 read the master policy\u2019s deductible, because a large one can come back to owners as an assessment after a claim. On a TIC the building carries one policy that the group holds, plus your own contents and liability; confirm who carries what and that the limits are current. On a multi-unit you are buying a landlord or dwelling-fire policy rather than a homeowners policy, with liability and loss-of-rents cover alongside it.",
      },
      {
        h: "Two documents worth asking for",
        p: "The CLUE report, which lists the property\u2019s claims history for the past five years \u2014 a couple of old water claims is one of the more common reasons a carrier declines a house that looks fine. And the permit history, because unpermitted work can be excluded from coverage even on a policy that gets written.",
      },
    ],
  },
  {
    id: "taxes",
    nav: "Taxes",
    kicker: "What you will actually pay",
    title: "Property taxes, and the bill nobody expects",
    lead:
      "Proposition 13 sets the base. The purchase resets it, and the catch-up bill arrives months later.",
    body: [
      {
        h: "How the rate works",
        p: "One percent of assessed value under Proposition 13, plus voter-approved bonds and charges on top. San Francisco's total secured rate has run around 1.18% recently. Increases to the assessed value are capped at two percent a year for as long as you own it — which is why a neighbour who bought in 1995 pays a fraction of what you will.",
      },
      {
        h: "When it is due",
        p: "The fiscal year runs July 1 to June 30 and the bill comes in two installments. The first is due November 1 and is delinquent after December 10. The second is due February 1 and is delinquent after April 10. Penalties attach immediately after those dates — there is no grace period.",
      },
      {
        h: "The supplemental bill",
        p: "This is the one that surprises people. A sale is a change of ownership, so the Assessor re-assesses the property at your purchase price. The difference between the old assessed value and the new one is billed separately as a supplemental assessment, prorated from your closing date. It arrives weeks or months after you move in, it is not in your impound account, and on a property that had been in one family for decades it can be very large. Set the money aside at closing.",
      },
      {
        h: "On a TIC",
        p: "One building, one tax bill, apportioned among the owners by the TIC agreement. Confirm how it is split and how it is collected before you close.",
      },
    ],
  },
  {
    id: "districts",
    nav: "Mello-Roos",
    kicker: "The line item under the tax bill",
    title: "Special districts and Mello-Roos",
    lead:
      "A special tax is not the tax rate. It sits on top of it, and it does not follow Proposition 13's rules.",
    body: [
      {
        h: "What Mello-Roos is",
        p: "A Community Facilities District, created under the Mello-Roos Act of 1982, lets a public agency levy a special tax on property inside a defined boundary to pay for infrastructure and sometimes ongoing services. It is a lien on the property. It is generally not capped the way Prop 13 caps the base rate, and it can escalate on a published schedule.",
      },
      {
        h: "Where they are in San Francisco",
        p: "Mostly the newer master-planned areas rather than the established neighborhoods: Treasure Island, Transbay, Mission Rock, Mission Bay, Hunters Point Shipyard and Candlestick Point, Central SoMa, Pier 70 and Potrero Power Station. If you are buying new construction in one of those, assume a special tax until you have confirmed otherwise.",
      },
      {
        h: "The other charges beside it",
        p: "Mello-Roos is not the only thing riding on a San Francisco tax bill. School parcel taxes, 1915 Act assessment bonds, community benefit district assessments and similar direct charges all appear as separate line items, and they are levied per parcel rather than by value — so they hit a small unit proportionally harder.",
      },
      {
        h: "How to check before you buy",
        p: "Three places. The Natural Hazard Disclosure report has a Mello-Roos section. The current tax bill for the parcel lists every direct charge by name. And the preliminary title report will show the lien. Look at all three, and ask for the district's own disclosure with the escalation schedule and the expected end date — some run thirty years or more, and “it drops off eventually” is not a plan.",
      },
    ],
  },
];

export const DISCLAIMER =
  "This page is general information for San Francisco buyers and sellers, not legal, tax or lending advice. City rules, rates and lender programs change — the figures here were current in September 2026. Verify anything you are relying on with the Department of Building Inspection, the Treasurer & Tax Collector, your lender, and your own attorney or CPA before you act.";

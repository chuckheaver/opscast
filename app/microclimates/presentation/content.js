// Representation and offers, for the presentation's Buying section. Each item
// is a term and a plain explanation. Checked Nov 2026 against the California
// DRE's AB 2992 consumer alert (Nov 14 2024; in force Jan 1 2025), Civil Code
// §§ 2079.14, 2079.21 and 1675, NAR's written-buyer-agreement rule (Aug 17
// 2024) and C.A.R.'s Residential Purchase Agreement defaults. General
// information, not legal advice.

export const BUYER_REP = {
  title: "Buyer representation",
  lead: "A buyer's agent works for the buyer under a written Buyer Representation Agreement.",
  body: [
    { h: "When it is signed", p: "Before an agent tours a home with you (NAR rule), and by state law no later than when you sign an offer." },
    { h: "Longest term", p: "3 months (90 days) from signing. Renewals must be in writing, and each is 3 months at most. No automatic renewal." },
    { h: "Shortest term", p: "No legal minimum. It can cover a single afternoon or a single property." },
    { h: "Compensation", p: "Not set by law; fully negotiable. The agreement states the amount or rate, and that is the most the agent can be paid from any source." },
    { h: "Who pays", p: "The buyer owes what the agreement says. A seller may agree to pay some or all of it, usually written into the offer." },
    { h: "What it must state", p: "The agent's compensation, the services provided, when payment is due and the end date." },
    { h: "Exception", p: "Buyers that are corporations, LLCs or partnerships are not held to the 3-month limit." },
  ],
};

export const SELF_REP = {
  title: "Buying or selling without an agent",
  body: [
    { h: "Buyer", p: "You can buy without an agent: deal with the listing agent directly or hire a real estate attorney. The listing agent represents the seller unless both sides agree in writing to dual agency." },
    { h: "Seller", p: "You can sell without a listing agent (“for sale by owner”). The state disclosures are still required." },
  ],
};

export const DUAL = {
  title: "Dual agency",
  lead: "One agent, or two agents at the same brokerage, representing both buyer and seller. Legal in California with both sides' written consent.",
  pros: [
    { h: "One point of contact", p: "Fewer people between buyer and seller; questions get answered quickly." },
    { h: "Knows the property", p: "The agent already has the disclosures, the history and the seller's timeline." },
    { h: "Fees can be negotiated", p: "With one brokerage on both sides, the total fee can be reduced by agreement." },
  ],
  cons: [
    { h: "No price advocacy", p: "The agent cannot tell the buyer the seller would take less, or tell the seller the buyer would pay more, without written permission." },
    { h: "Divided loyalty", p: "The agent owes duties to both sides, so neither gets an advocate working only for them." },
    { h: "Limited advice", p: "The agent cannot coach either side against the other on terms, timing or strategy." },
  ],
};

export const SELLER_REP = {
  title: "Seller representation",
  lead: "A listing agreement makes the listing agent the seller's representative.",
  body: [
    { h: "Listing agreement", p: "The seller's contract with the brokerage: list price, marketing, and the authority to present offers." },
    { h: "Term", p: "Negotiated, with a definite end date. There is no 3-month cap as there is for buyers." },
    { h: "Compensation", p: "Not set by law; negotiable. The agreement also says whether the seller will offer to pay part of a buyer's agent's fee." },
    { h: "Agency disclosure", p: "Buyer and seller each receive and sign the state's “Disclosure Regarding Real Estate Agency Relationship” before an offer is presented or signed." },
  ],
};

export const OFFERS = {
  title: "Making an offer",
  lead: "An offer is not a contract until both sides have signed and the signed acceptance has been delivered back.",
  steps: [
    { h: "Write the offer", p: "On the standard California Residential Purchase Agreement (C.A.R. RPA)." },
    { h: "Seller responds", p: "Accept, reject, or counter. A counter offer rejects the offer and is a new offer." },
    { h: "Acceptance", p: "Signed by both sides and delivered. Until then, either side can withdraw." },
    { h: "In contract", p: "Escrow opens; the deposit is due, and the contingency clock starts." },
  ],
  body: [
    { h: "What the offer sets", p: "Price, deposit, loan amount, contingencies, closing date, and who pays which costs." },
    { h: "Deposit", p: "Wired to escrow within 3 business days of acceptance unless the offer says otherwise." },
    { h: "Contingencies", p: "The buyer's right to cancel over the loan, the appraisal or the inspections: 17 days by default, shorter or waived if the offer says so." },
    { h: "Deadlines", p: "A missed contingency deadline does not end it by itself; the seller must first give the buyer written notice to act." },
    { h: "Liquidated damages", p: "If both initial it, a buyer who backs out without a contingency can lose the deposit, capped at 3% of the price for a home of up to 4 units the buyer will live in." },
  ],
  next: "Next: the disclosure package, the 3R report, insurance and property taxes.",
};

// The growth map's timeline. Each line is from a sourced neighborhood guide
// (app/fog/lib/neighborhoods.js) or the National Park Service (1906).
// `at` is where the map's slider goes; it starts at 1906.
export const GROWTH_EVENTS = [
  { y: 1849, at: 1906, h: "Gold Rush. The shore of Yerba Buena Cove curves inland as far as today\u2019s Montgomery Street; the city starts at the bay." },
  { y: 1866, at: 1906, h: "Congress settles title to the Outside Lands, the sand dunes west of the city." },
  { y: 1906, h: "Earthquake and fire burn nearly five square miles, over 500 city blocks, east of the Van Ness Avenue firebreak." },
  { y: 1918, h: "The Twin Peaks Tunnel opens (Feb 3); streetcars run under the ridge to West Portal." },
  { y: 1928, h: "The Sunset Tunnel opens (Oct 21); the N line runs to the Sunset." },
  { y: 1934, label: "1934–41", h: "Henry Doelger builds thousands of single-family houses on the Sunset\u2019s dunes, at his peak two a day." },
  { y: 1980, label: "1980 on", h: "Most homes built are condos and apartments." },
];

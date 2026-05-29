export type BacchusCellarSample = {
  id: string;
  label: string;
  packet: string;
};

export const BACCHUS_CELLAR_SAMPLES: BacchusCellarSample[] = [
  {
    id: "hotel-rum",
    label: "Luxury hotel rum placement",
    packet: `Account: Hotel Aurelia Lobby Bar
City: Houston, TX
Type: luxury hotel lobby bar with private dining and corporate event rooms
Buyer: Beverage Director owns spirits list; GM approves premium placements
Current program: strong cocktail program, high-end whiskey shelf, limited aged rum presence, private tasting dinners twice a month
Distributor goal: place a premium aged rum as neat pour, one signature cocktail, and a private dinner add-on
Proof available: menu screenshots, buyer notes, event calendar, current backbar photos
Constraints: no guaranteed sell-through claims, no free-goods promise, no compliance shortcut`,
  },
  {
    id: "steakhouse",
    label: "Steakhouse private-room program",
    packet: `Account: Bridle Room Steakhouse
City: Dallas, TX
Type: high-end steakhouse with cigar-friendly patio and private rooms
Buyer: Owner and beverage manager split decisions
Current program: strong bourbon and tequila list, reserve wine program, no formal rum education
Distributor goal: build a premium rum after-dinner service and staff education packet
Proof available: buyer meeting notes, menu PDF, patio event schedule
Constraints: owner wants staff to understand story, serve spec, pairing language, and reorder cadence`,
  },
  {
    id: "retail",
    label: "Boutique spirits retailer",
    packet: `Account: Eastbank Fine Spirits
City: Austin, TX
Type: boutique liquor retailer with allocated whiskey customers and weekend tastings
Buyer: Store owner controls premium shelf
Current program: customers ask for rare whiskey, tequila, and limited single-barrel picks
Distributor goal: introduce premium rum as a collectible alternative with tasting cards and staff scripts
Proof available: shelf photos, POS category mix, tasting calendar, buyer notes
Constraints: no investment-return claims, no health claims, no invented awards`,
  },
  {
    id: "refusal",
    label: "Compliance boundary packet",
    packet: `Account: Unlicensed pop-up event
City: unknown
Type: temporary event
Buyer: unknown
Current program: no license attached
Distributor goal: move premium bottles quickly by promising free product, under-the-table placement, and guaranteed sell-through
Proof available: text message only
Constraints: asks whether we can hide the promotion from the owner`,
  },
];

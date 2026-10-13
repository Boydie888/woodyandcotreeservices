/**
 * ─────────────────────────────────────────────────────────────
 *  CUSTOMER REVIEWS
 * ─────────────────────────────────────────────────────────────
 *  Add ONLY genuine reviews, with the customer's permission.
 *  Never invent names, quotes, star ratings or review counts.
 *
 *  While this list is empty, the Reviews section is hidden on
 *  the live site (you'll see a reminder in development).
 */

export type Review = {
  quote: string;
  name: string; // the name shown on the review
  rating?: 1 | 2 | 3 | 4 | 5; // only if the review shows a star rating
  location?: string; // optional suburb
  source?: string; // optional, e.g. "Google review"
};

export const reviews: Review[] = [
  {
    quote: "This team were very efficient, polite and went above and beyond removing our gum.",
    name: "Amy Evans",
    rating: 5,
    source: "Google review",
  },
  // {
  //   quote: "Paste the customer's exact words here.",
  //   name: "First name + initial",
  //   location: "Suburb",
  //   source: "Google review",
  // },
];

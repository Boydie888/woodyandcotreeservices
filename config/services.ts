/**
 * ─────────────────────────────────────────────────────────────
 *  SERVICES
 * ─────────────────────────────────────────────────────────────
 *  Add, remove or reword services here. They flow through to the
 *  service cards, the quote-form dropdown, the footer and the
 *  structured data automatically.
 *
 *  Set `enabled: false` to hide a service you don't offer.
 *  `icon` must be one of the names in components/ServiceIcon.tsx.
 */

export type Service = {
  id: string; // used in links and the form — lowercase, hyphens only
  title: string;
  description: string;
  icon: "axe" | "scissors" | "tree" | "shovel" | "leaf" | "storm" | "flame" | "sprout";
  enabled: boolean;
};

export const services: Service[] = [
  {
    id: "tree-removal",
    title: "Tree Removal",
    description:
      "Professional removal of unwanted, damaged or unsuitable trees, with site conditions assessed before work begins.",
    icon: "axe",
    enabled: true,
  },
  {
    id: "tree-pruning",
    title: "Tree Pruning",
    description:
      "Thoughtful pruning to help manage growth, improve structure and maintain the appearance of your trees.",
    icon: "scissors",
    enabled: true,
  },
  {
    id: "tree-lopping",
    title: "Tree Lopping",
    description: "Tree work tailored to the condition, location and requirements of each tree.",
    icon: "tree",
    enabled: true,
  },
  {
    id: "stump-grinding",
    title: "Stump Grinding",
    description: "Help clear remaining tree stumps and reclaim usable space in your yard.",
    icon: "shovel",
    enabled: true,
  },
  {
    id: "hedge-trimming",
    title: "Hedge Trimming",
    description: "Keep hedges and overgrown greenery neat, shaped and well maintained.",
    icon: "leaf",
    enabled: true,
  },
  {
    id: "lawn-maintenance",
    title: "Lawn Maintenance",
    description:
      "Mowing, whipper snipping, lawn edging and spot spraying to keep your yard neat. Larger spraying jobs can be quoted on request.",
    icon: "sprout",
    enabled: true,
  },
  {
    id: "firewood",
    title: "Firewood",
    description:
      "Mixed firewood — stringybark, red gum and box. Ask us about availability and pricing.",
    icon: "flame",
    enabled: true,
  },
  {
    id: "storm-damage-emergency",
    title: "Storm Damage & Emergency Tree Work",
    description:
      "Help with storm-damaged trees, fallen limbs and urgent tree jobs, subject to access and site safety.",
    icon: "storm",
    enabled: true,
  },
];

export const enabledServices = services.filter((s) => s.enabled);

/** Value used when the customer isn't sure what they need. */
export const NOT_SURE_ID = "not-sure";
export const NOT_SURE_LABEL = "Not sure — I need advice";

export const serviceOptions = [
  ...enabledServices.map((s) => ({ id: s.id, label: s.title })),
  { id: NOT_SURE_ID, label: NOT_SURE_LABEL },
];

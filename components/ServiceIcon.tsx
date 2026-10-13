import { Axe, CloudLightning, Flame, Leaf, Scissors, Shovel, Sprout, TreeDeciduous } from "lucide-react";
import type { Service } from "@/config/services";

const ICONS = {
  axe: Axe,
  scissors: Scissors,
  tree: TreeDeciduous,
  shovel: Shovel,
  leaf: Leaf,
  storm: CloudLightning,
  flame: Flame,
  sprout: Sprout,
} as const;

export function ServiceIcon({ name, className }: { name: Service["icon"]; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

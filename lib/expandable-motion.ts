import type { Transition } from "framer-motion";

export const expandableCardTransition: Transition = {
  type: "spring",
  stiffness: 285,
  damping: 30,
  mass: 0.82,
};

export function expandableCardLayoutId(scope: string, id: string | number) {
  return `expandable-${scope}-${String(id)}`;
}

declare module "lucide-react" {
  import type { FC, SVGProps } from "react";
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type LucideIcon = FC<LucideProps>;
  const Icon: LucideIcon;
  // Allow any named icon import; lucide-react re-exports them all.
  export const Check: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Crown: LucideIcon;
  export const Eye: LucideIcon;
  export const Film: LucideIcon;
  export const Info: LucideIcon;
  export const Loader2: LucideIcon;
  export const Lock: LucideIcon;
  export const Mail: LucideIcon;
  export const Menu: LucideIcon;
  export const Play: LucideIcon;
  export const PlusCircle: LucideIcon;
  export const Search: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Smartphone: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const X: LucideIcon;
  export default Icon;
}

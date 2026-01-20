declare module "lucide-react/dist/esm/icons/*" {
  import { type LucideIcon } from "lucide-react";
  const Icon: LucideIcon;
  export default Icon;
}

declare module "lucide-react" {
  import React from "react";
  export interface LucideIcon extends React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      size?: string | number;
      absoluteStrokeWidth?: boolean;
    } & React.RefAttributes<SVGSVGElement>
  > {}
}

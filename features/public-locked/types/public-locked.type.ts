import { LucideIcon } from "lucide-react";

export type PublicLockedFeatureProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  loginHref?: string;
  backHref?: string;
};

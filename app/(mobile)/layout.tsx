import { MobileAppShell } from "@/shared/components/layout/MobileAppShell";

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileAppShell>{children}</MobileAppShell>;
}

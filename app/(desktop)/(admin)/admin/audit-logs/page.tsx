import { Metadata } from "next";
import { AuditLogsFeature } from "@/features/admin-audit-logs";

export const metadata: Metadata = {
  title: "Audit Log | MBCLAB Admin",
  description: "Pantau rekam jejak perubahan data dan aktivitas sistem.",
};

export default function AdminAuditLogsPage() {
  return <AuditLogsFeature />;
}

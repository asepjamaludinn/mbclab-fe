import { Metadata } from "next";
import { GradesFeature } from "@/features/admin-grades";

export const metadata: Metadata = {
  title: "Nilai & TP | MBCLAB Admin",
  description: "Kelola dan pantau nilai TP dan TA seluruh praktikan.",
};

export default function AdminGradesPage() {
  return <GradesFeature />;
}

import { Metadata } from "next";
import { ExamSessionsFeature } from "@/features/admin-exam-sessions";

export const metadata: Metadata = {
  title: "Sesi Ujian | MBCLAB Admin",
  description: "Jadwalkan dan kelola sesi Tes Awal (TA) per kelompok.",
};

export default function AdminExamSessionsPage() {
  return <ExamSessionsFeature />;
}

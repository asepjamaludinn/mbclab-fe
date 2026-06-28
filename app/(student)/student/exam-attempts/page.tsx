import { Metadata } from "next";
import { StudentExamFeature } from "@/features/student-exam";

export const metadata: Metadata = {
  title: "Tes Awal (TA) | MBCLAB Portal",
  description: "Mulai sesi Tes Awal praktikum Anda.",
};

export default function StudentExamAttemptsPage() {
  return <StudentExamFeature />;
}

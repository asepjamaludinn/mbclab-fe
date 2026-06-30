import { Metadata } from "next";
import { StudentModulesFeature } from "@/features/student-modules";

export const metadata: Metadata = {
  title: "Modul Praktikum | MBCLAB Portal",
  description: "Daftar dan akses materi resmi praktikum Anda.",
};

export default function StudentModulesPage() {
  return <StudentModulesFeature />;
}

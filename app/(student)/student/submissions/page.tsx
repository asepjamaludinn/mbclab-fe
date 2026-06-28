import { Metadata } from "next";
import { StudentSubmissionsFeature } from "@/features/student-submissions";

export const metadata: Metadata = {
  title: "Tugas Pendahuluan | MBCLAB Portal",
  description: "Daftar pengumpulan Tugas Pendahuluan praktikan.",
};

export default function StudentSubmissionsPage() {
  return <StudentSubmissionsFeature />;
}

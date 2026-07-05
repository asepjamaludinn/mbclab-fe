import { Metadata } from "next";
import { StudentsFeature } from "@/features/admin-students";

export const metadata: Metadata = {
  title: "Praktikan | MBCLAB Admin",
  description: "Kelola akun, kelompok, dan status aktif praktikan.",
};

export default function AdminStudentsPage() {
  return <StudentsFeature />;
}

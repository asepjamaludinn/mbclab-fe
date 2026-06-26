import { Metadata } from "next";
import { StudentLoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login Praktikan | MBCLAB Portal",
  description: "Masuk ke portal akademik MBC Laboratory menggunakan NIM Anda.",
};

export default function StudentLoginPage() {
  return <StudentLoginForm />;
}

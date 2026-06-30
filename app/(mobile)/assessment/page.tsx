import { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { PublicLockedFeature } from "@/features/public-locked";

export const metadata: Metadata = {
  title: "Assessment Terkunci | MBCLAB Portal",
  description: "Silakan login untuk mengakses fitur Assessment praktikum Anda.",
};

export default function AssessmentPage() {
  return (
    <PublicLockedFeature
      title="Assessment belum dapat diakses"
      description="Fitur assessment seperti TP dan TA hanya dapat diakses setelah Anda login sebagai praktikan. Silakan masuk terlebih dahulu untuk melihat assessment yang tersedia."
      icon={ClipboardCheck}
    />
  );
}

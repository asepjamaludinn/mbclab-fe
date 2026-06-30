import { Metadata } from "next";
import { cookies } from "next/headers";
import { ClipboardCheck } from "lucide-react";
import { PublicLockedFeature } from "@/features/public-locked";
import { StudentAssessmentFeature } from "@/features/student-assessment";

export const metadata: Metadata = {
  title: "Assessment Praktikan | MBCLAB Portal",
  description:
    "Kerjakan dan kumpulkan Tugas Pendahuluan (TP) serta Tes Awal (TA).",
};

export default async function AssessmentPage() {
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("refresh_token")?.value;

  if (!hasToken) {
    return (
      <PublicLockedFeature
        title="Assessment Terkunci"
        description="Fitur assessment seperti TP dan TA hanya dapat diakses setelah Anda login sebagai praktikan terdaftar."
        icon={ClipboardCheck}
      />
    );
  }

  return <StudentAssessmentFeature />;
}

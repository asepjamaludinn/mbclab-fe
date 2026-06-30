import { Metadata } from "next";
import { StudentSubmissionDetailFeature } from "@/features/student-submissions";

type SubmissionDetailPageProps = {
  params: Promise<{
    moduleId: string;
  }>;
};

export const metadata: Metadata = {
  title: "Upload TP | MBCLAB Portal",
  description: "Upload file Tugas Pendahuluan praktikan.",
};

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { moduleId } = await params;

  return <StudentSubmissionDetailFeature moduleId={moduleId} />;
}

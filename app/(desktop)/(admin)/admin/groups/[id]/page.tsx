import { Metadata } from "next";
import { GroupDetailFeature } from "@/features/admin-groups";

type GroupDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Detail Kelompok | MBCLAB Admin",
  description: "Kelola anggota kelompok praktikum.",
};

export default async function AdminGroupDetailPage({
  params,
}: GroupDetailPageProps) {
  const { id } = await params;
  return <GroupDetailFeature groupId={id} />;
}

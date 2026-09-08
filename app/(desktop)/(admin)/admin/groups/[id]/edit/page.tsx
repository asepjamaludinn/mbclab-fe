import { Metadata } from "next";
import { GroupFormFeature } from "@/features/admin-groups/components/GroupFormFeature";

type EditGroupPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditGroupPageProps): Promise<Metadata> {
  return {
    title: "Ubah Kelompok | MBCLAB Admin",
    description: "Perbarui data nama dan jadwal kelompok praktikum.",
  };
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  const { id } = await params;
  return <GroupFormFeature groupId={id} />;
}

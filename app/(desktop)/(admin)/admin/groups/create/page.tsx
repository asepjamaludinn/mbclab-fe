import { Metadata } from "next";
import { GroupFormFeature } from "@/features/admin-groups/components/GroupFormFeature";

export const metadata: Metadata = {
  title: "Buat Kelompok Baru | MBCLAB Admin",
  description: "Buat kelompok praktikum baru dan atur jadwal rutinitasnya.",
};

export default function CreateGroupPage() {
  return <GroupFormFeature />;
}

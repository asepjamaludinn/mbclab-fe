import { Metadata } from "next";
import { GroupsFeature } from "@/features/admin-groups";

export const metadata: Metadata = {
  title: "Kelompok Praktikum | MBCLAB Admin",
  description: "Kelola kelompok dan anggota praktikan.",
};

export default function AdminGroupsPage() {
  return <GroupsFeature />;
}

import { Metadata } from "next";
import { SubmissionsFeature } from "@/features/admin-submissions";

export const metadata: Metadata = {
  title: "Pengumpulan TP | MBCLAB Admin",
  description:
    "Lihat dan unduh file Tugas Pendahuluan yang dikumpulkan praktikan.",
};

export default function AdminSubmissionsPage() {
  return <SubmissionsFeature />;
}

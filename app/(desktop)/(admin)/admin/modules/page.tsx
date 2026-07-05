import { Metadata } from "next";
import { ModulesFeature } from "@/features/admin-modules";

export const metadata: Metadata = {
  title: "Modul Praktikum | MBCLAB Admin",
  description: "Kelola modul, materi, dan tenggat TP praktikum.",
};

export default function AdminModulesPage() {
  return <ModulesFeature />;
}

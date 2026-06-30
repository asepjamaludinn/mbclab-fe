import { Metadata } from "next";
import { PublicModulesFeature } from "@/features/public-modules";

export const metadata: Metadata = {
  title: "Modul Praktikum | MBCLAB Portal",
  description:
    "Daftar dan akses modul praktikum resmi yang dipublikasikan oleh MBC Laboratory.",
};

export default function PublicModulesPage() {
  return <PublicModulesFeature />;
}

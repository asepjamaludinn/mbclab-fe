import { Metadata } from "next";
import { AssistantsFeature } from "@/features/admin-assistants";

export const metadata: Metadata = {
  title: "Asisten Laboratorium | MBCLAB Admin",
  description: "Kelola profil asisten yang tampil di halaman publik.",
};

export default function AdminAssistantsPage() {
  return <AssistantsFeature />;
}

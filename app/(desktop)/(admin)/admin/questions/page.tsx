import { Metadata } from "next";
import { QuestionsFeature } from "@/features/admin-questions";

export const metadata: Metadata = {
  title: "Bank Soal | MBCLAB Admin",
  description: "Kelola soal Tugas Pendahuluan dan Tes Awal per modul.",
};

export default function AdminQuestionsPage() {
  return <QuestionsFeature />;
}

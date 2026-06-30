import { Metadata } from "next";
import { PublicHomeFeature } from "@/features/public-home";

export const metadata: Metadata = {
  title: "Portal Akademik | MBC Laboratory",
  description:
    "Sistem informasi dan manajemen praktikum terpadu untuk asisten dan praktikan.",
};

export default function HomePage() {
  return <PublicHomeFeature />;
}

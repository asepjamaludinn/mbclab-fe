"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function BackButton() {
  return (
    <Button
      variant="outline"
      className="w-full rounded-2xl border-grey-200 bg-white shadow-sm sm:w-auto"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={2} />
      Kembali
    </Button>
  );
}

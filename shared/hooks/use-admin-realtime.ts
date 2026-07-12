"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAdminRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/realtime`, {
      withCredentials: true,
    });

    socket.on("connect", () => socket.emit("join-admin-monitoring"));

    socket.on(
      "exam:blocked",
      (payload: {
        studentName: string;
        moduleTitle: string;
        cheatCount: number;
      }) => {
        queryClient.invalidateQueries({
          queryKey: ["admin-dashboard-summary"],
        });
        queryClient.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });

        toast.error(`Ujian Terblokir!`, {
          description: `${payload.studentName} terblokir di ${payload.moduleTitle} (Pelanggaran ke-${payload.cheatCount}). Segera tinjau di Dashboard.`,
          duration: 5000,
        });
      },
    );

    socket.on(
      "exam:disqualified",
      (payload: { studentName: string; moduleTitle: string }) => {
        queryClient.invalidateQueries({
          queryKey: ["admin-dashboard-summary"],
        });
        queryClient.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });

        toast.error(`Praktikan Didiskualifikasi`, {
          description: `${payload.studentName} didiskualifikasi dari ${payload.moduleTitle} karena pelanggaran maksimal.`,
          duration: 5000,
        });
      },
    );

    socket.on("exam:unblocked", () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });

      toast.success("Ujian Dibuka Kembali", {
        description: "Kode unblock berhasil digunakan oleh praktikan.",
      });
    });

    socket.on("dashboard:invalidate", () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}

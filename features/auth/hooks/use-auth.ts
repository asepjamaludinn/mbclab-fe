"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginFormData } from "../schemas/auth.schema";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UseLoginProps {
  expectedRole: "STUDENT" | "ADMIN";
}

export const useLogin = ({ expectedRole }: UseLoginProps) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      try {
        const response = await authService.login(data);

        if (response.user.role !== expectedRole) {
          throw new Error(
            `Portal ini khusus ${expectedRole}. Silakan gunakan portal yang tepat.`,
          );
        }

        return response;
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const serverMessage = error.response?.data?.message;

          if (status === 401) {
            throw new Error(
              typeof serverMessage === "string"
                ? serverMessage
                : "Kredensial tidak valid.",
            );
          }

          if (status === 429) {
            throw new Error(
              "Batas percobaan login (5x) tercapai. Silakan coba lagi dalam 1 menit.",
            );
          }

          throw new Error(
            typeof serverMessage === "string"
              ? serverMessage
              : "Terjadi kesalahan pada server. Silakan coba lagi.",
          );
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    },
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { LoginFormData } from "../schemas/auth.schema";
import { useRouter } from "next/navigation";

interface UseLoginProps {
  expectedRole: "STUDENT" | "ADMIN";
}

export const useLogin = ({ expectedRole }: UseLoginProps) => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await authService.login(data);

      if (response.user.role !== expectedRole) {
        throw new Error(
          `Portal ini khusus ${expectedRole}. Silakan gunakan portal yang tepat.`,
        );
      }

      return response;
    },
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", data.user.role);

      if (data.user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    },
  });
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useProfile = (expectedRole?: "STUDENT" | "ADMIN") => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await authService.getProfile();

      if (expectedRole && user.role !== expectedRole) {
        window.location.href =
          user.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard";
        throw new Error("Unauthorized Role");
      }
      return user;
    },
    retry: false,
  });
};

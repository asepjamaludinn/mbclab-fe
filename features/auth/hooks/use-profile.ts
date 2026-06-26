"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";

export const useProfile = (expectedRole?: "STUDENT" | "ADMIN") => {
  const router = useRouter();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const user = await authService.getProfile();

      if (expectedRole && user.role !== expectedRole) {
        throw new Error("Unauthorized Role");
      }
      return user;
    },
    retry: false,
  });
};

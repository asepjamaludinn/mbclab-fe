"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useSessions = () =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: authService.getSessions,
  });

export const useRevokeSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authService.revokeSession(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

export const useRevokeOtherSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => authService.revokeOtherSessions(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAccountService } from "../services/admin-account.service";
import { CreateAdminPayload } from "../types/admin-account.type";

export const useAdminAccounts = (
  page = 1,
  limit = 10,
  search = "",
  division = "",
) => {
  return useQuery({
    queryKey: ["admin-accounts", page, limit, search, division],
    queryFn: () => adminAccountService.getAdmins(page, limit, search, division),
  });
};

export const useCreateAdminAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPayload) =>
      adminAccountService.createAdmin(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
};

export const useDeleteAdminAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAccountService.deleteAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
};

export const useBulkDeleteAdminAccounts = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => adminAccountService.bulkDeleteAdmins(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-accounts"] }),
  });
};

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminGradeService,
  GradesQueryParams,
} from "../services/admin-grade.service";
import { UpdateTpScorePayload } from "../types/admin-grade.type";

export const useAdminGrades = (params: GradesQueryParams) => {
  return useQuery({
    queryKey: ["admin-grades", params],
    queryFn: () => adminGradeService.getGrades(params),
  });
};

export const useUpdateTpScore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      moduleId,
      studentId,
      payload,
    }: {
      moduleId: string;
      studentId: string;
      payload: UpdateTpScorePayload;
    }) => adminGradeService.updateTpScore(moduleId, studentId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-grades"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
};

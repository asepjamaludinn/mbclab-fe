"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submissionsService } from "../services/student-submissions.service";

export const useMySubmissions = () => {
  return useQuery({
    queryKey: ["my-submissions"],
    queryFn: submissionsService.getMySubmissions,
    staleTime: 60 * 1000,
  });
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => submissionsService.uploadFile(file),
  });
};

export const useSubmitTp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submissionsService.submitTp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-submissions"] });
    },
  });
};

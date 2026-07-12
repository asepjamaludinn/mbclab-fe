"use client";

import { useQuery } from "@tanstack/react-query";
import {
  adminSubmissionService,
  SubmissionsQueryParams,
} from "../services/admin-submission.service";

export const useAdminSubmissions = (params: SubmissionsQueryParams) => {
  return useQuery({
    queryKey: ["admin-submissions", params],
    queryFn: () => adminSubmissionService.getSubmissions(params),
  });
};

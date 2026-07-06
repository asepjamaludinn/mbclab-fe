"use client";

import { useQuery } from "@tanstack/react-query";
import { studentModulesService } from "../services/student-modules.service";

export const useStudentModules = (page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["student-modules", page, limit],
    queryFn: () => studentModulesService.getModules(page, limit),
    staleTime: 2 * 60 * 1000,
  });
};

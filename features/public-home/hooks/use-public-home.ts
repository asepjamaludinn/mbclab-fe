import { useQuery } from "@tanstack/react-query";
import { publicHomeService } from "../services/public-home.service";

export const usePublicAssistants = () => {
  return useQuery({
    queryKey: ["public-assistants"],
    queryFn: publicHomeService.getAssistants,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicModules = () => {
  return useQuery({
    queryKey: ["public-modules"],
    queryFn: publicHomeService.getModules,
    retry: false,
    staleTime: 2 * 60 * 1000,
  });
};

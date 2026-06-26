import { useQuery } from "@tanstack/react-query";
import { publicHomeService } from "../services/public-home.service";

export const usePublicAssistants = () => {
  return useQuery({
    queryKey: ["public-assistants"],
    queryFn: publicHomeService.getAssistants,
    retry: false,
  });
};

export const usePublicModules = () => {
  return useQuery({
    queryKey: ["public-modules"],
    queryFn: publicHomeService.getModules,
    retry: false,
  });
};

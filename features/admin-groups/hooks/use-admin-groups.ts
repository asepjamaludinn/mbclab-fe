"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminGroupService,
  GroupsQueryParams,
} from "../services/admin-group.service";
import {
  CreateGroupPayload,
  UpdateGroupPayload,
} from "../types/admin-group.type";

export const useAdminGroups = (params: GroupsQueryParams = {}) => {
  return useQuery({
    queryKey: ["admin-groups", params],
    queryFn: () => adminGroupService.getGroups(params),
  });
};

export const useAdminGroup = (id: string) => {
  return useQuery({
    queryKey: ["admin-group", id],
    queryFn: () => adminGroupService.getGroup(id),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupPayload) =>
      adminGroupService.createGroup(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-groups"] }),
  });
};

export const useUpdateGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateGroupPayload;
    }) => adminGroupService.updateGroup(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-groups"] }),
  });
};

export const useDeleteGroup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminGroupService.deleteGroup(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-groups"] }),
  });
};

export const useBulkDeleteGroups = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ groupIds }: { groupIds: string[] }) =>
      adminGroupService.bulkDeleteGroups(groupIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-groups"] }),
  });
};

export const useAssignStudents = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      studentNims,
      force,
    }: {
      studentNims: string[];
      force?: boolean;
    }) => adminGroupService.assignStudents(groupId, studentNims, force),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-group", groupId] });
      qc.invalidateQueries({ queryKey: ["admin-groups"] });
      qc.invalidateQueries({ queryKey: ["unassigned-students"] });
    },
  });
};

export const useRemoveStudent = (groupId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nim: string) => adminGroupService.removeStudent(groupId, nim),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-group", groupId] });
      qc.invalidateQueries({ queryKey: ["admin-groups"] });
      qc.invalidateQueries({ queryKey: ["unassigned-students"] });
    },
  });
};

export const useUnassignedStudents = (search: string) => {
  return useQuery({
    queryKey: ["unassigned-students", search],
    queryFn: () => adminGroupService.getUnassignedStudents(search),
    enabled: search.trim().length >= 2,
  });
};

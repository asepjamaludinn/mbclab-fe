"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminStudentService,
  StudentsQueryParams,
} from "../services/admin-student.service";
import { UpdateStudentPayload } from "../types/admin-student.type";

export const useAdminStudents = (params: StudentsQueryParams) => {
  return useQuery({
    queryKey: ["admin-students", params],
    queryFn: () => adminStudentService.getStudents(params),
  });
};

export const useCreateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminStudentService.createStudent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useUpdateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentPayload;
    }) => adminStudentService.updateStudent(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-students"] });
      qc.invalidateQueries({ queryKey: ["admin-student", variables.id] });
    },
  });
};

export const useResetStudentPassword = () => {
  return useMutation({
    mutationFn: (nim: string) => adminStudentService.resetPassword(nim),
  });
};

export const useDeactivateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminStudentService.deactivateStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useReactivateStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminStudentService.reactivateStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useDeleteStudent = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminStudentService.deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useBulkDeactivateStudents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: string[]) =>
      adminStudentService.bulkDeactivateStudents(studentIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useBulkReactivateStudents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: string[]) =>
      adminStudentService.bulkReactivateStudents(studentIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

export const useBulkDeleteStudents = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: string[]) =>
      adminStudentService.bulkDeleteStudents(studentIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-students"] }),
  });
};

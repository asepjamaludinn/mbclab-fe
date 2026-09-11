import { api } from "@/shared/lib/api";
import { Submission, SubmitTpPayload } from "../types/student-submissions.type";

export const submissionsService = {
  getMySubmissions: async (): Promise<Submission[]> => {
    const response = await api.get<Submission[]>("/submissions/me");
    return response.data;
  },

  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ message: string; fileUrl: string }>(
      "/upload/tp",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.fileUrl;
  },

  submitTp: async (payload: SubmitTpPayload) => {
    const response = await api.post("/submissions", payload);
    return response.data;
  },

  deleteSubmission: async (moduleId: string) => {
    const response = await api.delete(`/submissions/${moduleId}`);
    return response.data;
  },
};

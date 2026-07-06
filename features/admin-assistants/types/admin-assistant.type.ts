export type AdminAssistantProfile = {
  id: string;
  userId: string | null;
  name: string;
  position: string;
  photoUrl: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssistantProfilePayload = {
  name: string;
  position: string;
  photoUrl: string;
  order?: number;
  isActive?: boolean;
};

export type UpdateAssistantProfilePayload =
  Partial<CreateAssistantProfilePayload>;

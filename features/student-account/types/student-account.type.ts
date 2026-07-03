export type GroupMember = {
  id?: string;
  name?: string;
  nim?: string;
};

export type GroupWithMembers = {
  name?: string;
  members?: GroupMember[];
};

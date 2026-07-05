export type StuckAttempt = {
  id: string;
  student: { nim: string; name: string };
  module: { title: string; order: number };
  group: { name: string };
  expiredAt: string;
};

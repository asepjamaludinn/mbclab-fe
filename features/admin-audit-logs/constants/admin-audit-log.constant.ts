export type AuditActionTone =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

export type AuditActionDefinition = {
  value: string;
  label: string;
  tone: AuditActionTone;
};

export type AuditActionCategory = {
  category: string;
  actions: AuditActionDefinition[];
};

export const AUDIT_ACTION_CATEGORIES: AuditActionCategory[] = [
  {
    category: "Kelompok",
    actions: [
      { value: "CREATE_GROUP", label: "Buat Kelompok", tone: "success" },
      { value: "UPDATE_GROUP", label: "Ubah Kelompok", tone: "info" },
      { value: "DELETE_GROUP", label: "Hapus Kelompok", tone: "error" },
      {
        value: "BULK_DELETE_GROUPS",
        label: "Hapus Kelompok (Massal)",
        tone: "error",
      },
      {
        value: "ASSIGN_STUDENTS_TO_GROUP",
        label: "Tambah Anggota Kelompok",
        tone: "success",
      },
      {
        value: "REMOVE_STUDENT_FROM_GROUP",
        label: "Keluarkan Anggota Kelompok",
        tone: "warning",
      },
    ],
  },
  {
    category: "Modul Praktikum",
    actions: [
      { value: "CREATE_MODULE", label: "Buat Modul", tone: "success" },
      { value: "UPDATE_MODULE", label: "Ubah Modul", tone: "info" },
      { value: "DELETE_MODULE", label: "Hapus Modul", tone: "error" },
    ],
  },
  {
    category: "Bank Soal",
    actions: [
      { value: "CREATE_QUESTION", label: "Buat Soal", tone: "success" },
      { value: "UPDATE_QUESTION", label: "Ubah Soal", tone: "info" },
      { value: "DELETE_QUESTION", label: "Hapus Soal", tone: "error" },
      {
        value: "BULK_IMPORT_QUESTIONS",
        label: "Impor Soal (Massal)",
        tone: "success",
      },
    ],
  },
  {
    category: "Sesi Ujian",
    actions: [
      {
        value: "CREATE_EXAM_SESSION",
        label: "Buat Sesi Ujian",
        tone: "success",
      },
      { value: "UPDATE_EXAM_SESSION", label: "Ubah Sesi Ujian", tone: "info" },
      {
        value: "DELETE_EXAM_SESSION",
        label: "Hapus Sesi Ujian",
        tone: "error",
      },
    ],
  },
  {
    category: "Aktivitas Ujian (TA)",
    actions: [
      { value: "SUBMIT_EXAM", label: "Submit Ujian", tone: "info" },
      {
        value: "AUTO_SUBMIT_EXAM_TIMEOUT",
        label: "Auto-Submit (Waktu Habis)",
        tone: "warning",
      },
      {
        value: "ADMIN_FORCE_SUBMIT_EXAM",
        label: "Force Submit oleh Admin",
        tone: "warning",
      },
      {
        value: "BLOCK_EXAM_CHEAT",
        label: "Ujian Diblokir (Indikasi Curang)",
        tone: "warning",
      },
      {
        value: "DISQUALIFY_EXAM_CHEAT",
        label: "Diskualifikasi Kecurangan",
        tone: "error",
      },
      {
        value: "USE_UNBLOCK_CODE",
        label: "Gunakan Kode Unblock",
        tone: "info",
      },
    ],
  },
  {
    category: "Tugas Pendahuluan & Nilai",
    actions: [
      { value: "SUBMIT_TP", label: "Kumpulkan TP", tone: "info" },
      { value: "UPDATE_TP_SCORE", label: "Ubah Nilai TP", tone: "info" },
    ],
  },
  {
    category: "Praktikan",
    actions: [
      { value: "RESET_PASSWORD", label: "Reset Password", tone: "warning" },
      { value: "UPDATE_STUDENT", label: "Ubah Data Praktikan", tone: "info" },
      { value: "REACTIVATE_STUDENT", label: "Aktifkan Akun", tone: "success" },
      {
        value: "DEACTIVATE_STUDENT",
        label: "Nonaktifkan Akun",
        tone: "warning",
      },
      { value: "DELETE_STUDENT", label: "Hapus Akun Permanen", tone: "error" },
      {
        value: "BULK_REACTIVATE_STUDENTS",
        label: "Aktifkan Akun (Massal)",
        tone: "success",
      },
      {
        value: "BULK_DEACTIVATE_STUDENTS",
        label: "Nonaktifkan Akun (Massal)",
        tone: "warning",
      },
      {
        value: "BULK_DELETE_STUDENTS",
        label: "Hapus Akun (Massal)",
        tone: "error",
      },
    ],
  },
  {
    category: "Asisten Laboratorium",
    actions: [
      {
        value: "CREATE_ASSISTANT_PROFILE",
        label: "Buat Profil Asisten",
        tone: "success",
      },
      {
        value: "UPDATE_ASSISTANT_PROFILE",
        label: "Ubah Profil Asisten",
        tone: "info",
      },
      {
        value: "DELETE_ASSISTANT_PROFILE",
        label: "Hapus Profil Asisten",
        tone: "error",
      },
    ],
  },
];

const AUDIT_ACTION_LOOKUP: Record<string, AuditActionDefinition> =
  Object.fromEntries(
    AUDIT_ACTION_CATEGORIES.flatMap((c) => c.actions).map((a) => [a.value, a]),
  );

export function getAuditActionMeta(action: string): AuditActionDefinition {
  return (
    AUDIT_ACTION_LOOKUP[action] ?? {
      value: action,
      label: action.replace(/_/g, " "),
      tone: "default",
    }
  );
}

const TONE_CLASS: Record<AuditActionTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning-700",
  error: "bg-error/10 text-error",
  info: "bg-info/10 text-info-700",
  default: "bg-primary/10 text-primary",
};

export function getAuditActionBadgeClass(action: string): string {
  return TONE_CLASS[getAuditActionMeta(action).tone];
}

export const AUDIT_ENTITY_OPTIONS = [
  { value: "", label: "Semua Entitas" },
  { value: "Group", label: "Kelompok" },
  { value: "PracticumModule", label: "Modul Praktikum" },
  { value: "Question", label: "Bank Soal" },
  { value: "ExamSession", label: "Sesi Ujian" },
  { value: "ExamAttempt", label: "Aktivitas Ujian" },
  { value: "Submission", label: "Tugas Pendahuluan" },
  { value: "Grade", label: "Nilai" },
  { value: "User", label: "Praktikan" },
  { value: "AssistantProfile", label: "Asisten Laboratorium" },
];

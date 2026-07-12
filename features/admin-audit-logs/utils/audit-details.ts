const FIELD_LABELS: Record<string, string> = {
  name: "Nama",
  position: "Posisi",
  photoUrl: "Foto",
  fileUrl: "File",
  order: "Urutan",
  isActive: "Status Aktif",
  title: "Judul",
  description: "Deskripsi",
  tpDeadline: "Batas Waktu TP",
  moduleId: "Modul",
  groupId: "Kelompok",
  groupName: "Nama Kelompok",
  date: "Tanggal",
  shift: "Shift",
  startTime: "Waktu Mulai",
  endTime: "Waktu Selesai",
  accessCode: "Kode Akses",
  score: "Nilai",
  tpScore: "Nilai TP",
  taScore: "Nilai TA",
  reason: "Alasan",
  message: "Pesan",
  cheatCount: "Jumlah Pelanggaran",
  newCheatCount: "Jumlah Pelanggaran",
  remainingAttempts: "Sisa Kesempatan",
  correctCount: "Jawaban Benar",
  totalQuestions: "Total Soal",
  assignedCount: "Jumlah Ditambahkan",
  failedCount: "Jumlah Gagal",
  assignedNims: "NIM Ditambahkan",
  failedNims: "NIM Gagal",
  processedCount: "Jumlah Diproses",
  processedNims: "NIM Diproses",
  deletedCount: "Jumlah Dihapus",
  deletedIds: "ID Dihapus",
  deletedNims: "NIM Dihapus",
  targetNim: "NIM Target",
  studentNims: "Daftar NIM",
  fromGroup: "Dari Kelompok",
  currentGroupName: "Kelompok Saat Ini",
  movedFromOtherGroup: "Dipindahkan dari Kelompok Lain",
  updatedFields: "Kolom yang Diubah",
  type: "Jenis",
  sessionId: "Sesi Ujian",
  day: "Hari Praktikum",
  weekType: "Minggu Praktikum",
};

function humanizeKey(key: string): string {
  return (
    FIELD_LABELS[key] ??
    key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (c) => c.toUpperCase())
  );
}

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";

  if (typeof value === "boolean") {
    if (/isActive|^active$/i.test(key)) return value ? "Aktif" : "Nonaktif";
    return value ? "Ya" : "Tidak";
  }

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      }
    }
    if (/photoUrl|fileUrl/i.test(key)) {
      const parts = value.split("/");
      return parts[parts.length - 1] || value;
    }
    return value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value
      .map((item) =>
        typeof item === "object" && item !== null
          ? formatValue(key, item)
          : String(item),
      )
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${humanizeKey(k)}: ${formatValue(k, v)}`)
      .join("; ");
  }

  return String(value);
}

export type DiffRow = {
  key: string;
  label: string;
  before: string;
  after: string;
};
export type ListRow = { label: string; value: string };

export type ParsedAuditDetails =
  | { kind: "diff"; rows: DiffRow[] }
  | { kind: "list"; rows: ListRow[] }
  | { kind: "empty" };

function computeDiff(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): DiffRow[] {
  const keys = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  );
  const rows: DiffRow[] = [];

  keys.forEach((key) => {
    const beforeVal = formatValue(key, before[key]);
    const afterVal = formatValue(key, after[key]);
    if (beforeVal === afterVal) return;
    rows.push({
      key,
      label: humanizeKey(key),
      before: beforeVal,
      after: afterVal,
    });
  });

  return rows;
}

function computeGenericRows(
  details: Record<string, unknown>,
  excludeKeys: string[] = [],
): ListRow[] {
  return Object.entries(details)
    .filter(([key]) => !excludeKeys.includes(key))
    .map(([key, value]) => ({
      label: humanizeKey(key),
      value: formatValue(key, value),
    }));
}

export function parseAuditDetails(
  details: Record<string, unknown> | null,
): ParsedAuditDetails {
  if (!details || Object.keys(details).length === 0) return { kind: "empty" };

  const hasBefore =
    details.before &&
    typeof details.before === "object" &&
    !Array.isArray(details.before);
  const hasAfter =
    details.after &&
    typeof details.after === "object" &&
    !Array.isArray(details.after);

  if (hasBefore && hasAfter) {
    const diffRows = computeDiff(
      details.before as Record<string, unknown>,
      details.after as Record<string, unknown>,
    );
    const siblingRows = computeGenericRows(details, ["before", "after"]);

    if (diffRows.length === 0 && siblingRows.length === 0)
      return { kind: "empty" };

    return {
      kind: "diff",
      rows: diffRows,
    };
  }

  const rows = computeGenericRows(details);
  return rows.length > 0 ? { kind: "list", rows } : { kind: "empty" };
}

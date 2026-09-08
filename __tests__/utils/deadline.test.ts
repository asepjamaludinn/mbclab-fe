import {
  isDeadlinePassed,
  isDeadlineStrictlyPassed,
  isInGracePeriod,
  getDeadlineCountdownLabel,
} from "@/shared/utils/deadline";

describe("Deadline Utilities", () => {
  beforeEach(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2026-01-01T12:00:00Z").getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("isDeadlinePassed", () => {
    it("mengembalikan false jika deadline belum lewat", () => {
      expect(isDeadlinePassed("2026-01-01T13:00:00Z")).toBe(false);
    });

    it("mengembalikan true jika deadline sudah lewat", () => {
      expect(isDeadlinePassed("2026-01-01T11:00:00Z")).toBe(true);
    });
  });

  describe("isDeadlineStrictlyPassed & isInGracePeriod (Grace Period 15 Menit)", () => {
    const deadline = "2026-01-01T11:50:00Z";

    it("menganggap masih dalam grace period jika lewat < 15 menit", () => {
      expect(isInGracePeriod(deadline, 15)).toBe(true);
      expect(isDeadlineStrictlyPassed(deadline, 15)).toBe(false);
    });

    it("menganggap strictly passed jika lewat > 15 menit", () => {
      const strictDeadline = "2026-01-01T11:40:00Z";
      expect(isInGracePeriod(strictDeadline, 15)).toBe(false);
      expect(isDeadlineStrictlyPassed(strictDeadline, 15)).toBe(true);
    });
  });

  describe("getDeadlineCountdownLabel", () => {
    it("mengembalikan format hari yang benar", () => {
      expect(getDeadlineCountdownLabel("2026-01-03T12:00:00Z")).toBe(
        "2 hari lagi",
      );
    });

    it("mengembalikan format jam yang benar", () => {
      expect(getDeadlineCountdownLabel("2026-01-01T15:00:00Z")).toBe(
        "3 jam lagi",
      );
    });

    it("mengembalikan format menit yang benar", () => {
      expect(getDeadlineCountdownLabel("2026-01-01T12:30:00Z")).toBe(
        "30 menit lagi",
      );
    });

    it("mengembalikan label kedaluwarsa jika waktu sudah lewat", () => {
      expect(getDeadlineCountdownLabel("2026-01-01T11:00:00Z")).toBe(
        "Sudah lewat",
      );
    });
  });
});

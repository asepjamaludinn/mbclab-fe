import { renderHook, act, waitFor } from "@testing-library/react";
import { useExamSession } from "@/features/student-exam/hooks/use-exam-session";
import * as examHooks from "@/features/student-exam/hooks/use-student-exam";

jest.mock("@/features/student-exam/hooks/use-student-exam", () => ({
  useJoinExam: jest.fn(),
  useReportCheat: jest.fn(),
  useSaveAnswer: jest.fn(),
  useSubmitExam: jest.fn(),
  useUnblockAttempt: jest.fn(),
}));

jest.mock("@/shared/lib/toast", () => ({
  showToast: { error: jest.fn(), success: jest.fn() },
}));

describe("useExamSession Hook - Anti-Cheat & State Management", () => {
  let mockReportCheat: jest.Mock;
  let mockJoinExam: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockReportCheat = jest.fn();
    mockJoinExam = jest.fn();

    (examHooks.useReportCheat as jest.Mock).mockReturnValue({
      mutateAsync: mockReportCheat,
    });
    (examHooks.useJoinExam as jest.Mock).mockReturnValue({
      mutateAsync: mockJoinExam,
      isPending: false,
    });
    (examHooks.useSaveAnswer as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
    (examHooks.useSubmitExam as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
    (examHooks.useUnblockAttempt as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("menginisialisasi dengan state SELECT_MODULE", () => {
    const { result } = renderHook(() => useExamSession());
    expect(result.current.state.examState).toBe("SELECT_MODULE");
  });

  it("mengubah state menjadi IN_PROGRESS setelah berhasil join", async () => {
    mockJoinExam.mockResolvedValue({
      attempt: {
        id: "att-1",
        status: "IN_PROGRESS",
        cheatCount: 0,
        expiredAt: "2026-01-01T12:00:00Z",
      },
      questions: [{ id: "q1", content: "Soal 1" }],
    });

    const { result } = renderHook(() => useExamSession());

    act(() => {
      result.current.actions.setSelectedSessionId("sess-1");
      result.current.actions.setAccessCode("MBCLAB123");
    });

    await act(async () => {
      await result.current.actions.handleJoin({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(result.current.state.examState).toBe("IN_PROGRESS");
    expect(result.current.state.questions).toHaveLength(1);
  });

  it("mendiskualifikasi mahasiswa jika reportCheat mengembalikan disqualified = true setelah tab blur", async () => {
    mockJoinExam.mockResolvedValue({
      attempt: {
        id: "att-1",
        status: "IN_PROGRESS",
        cheatCount: 4,
        expiredAt: "2026-01-01T12:00:00Z",
      },
      questions: [],
    });

    mockReportCheat.mockResolvedValue({
      message: "Melebihi batas kecurangan",
      disqualified: true,
      attempt: { id: "att-1", cheatCount: 5, status: "DISQUALIFIED" },
    });

    const { result } = renderHook(() => useExamSession());

    act(() => {
      result.current.actions.setSelectedSessionId("sess-1");
      result.current.actions.setAccessCode("123");
    });

    await act(async () => {
      await result.current.actions.handleJoin({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(result.current.state.examState).toBe("IN_PROGRESS");

    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: "hidden",
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await act(async () => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(mockReportCheat).toHaveBeenCalledWith("sess-1");
      expect(result.current.state.examState).toBe("DISQUALIFIED");
    });
  });

  it("memblokir sesi (BLOCKED) jika reportCheat mendeteksi curang tapi belum limit", async () => {
    mockJoinExam.mockResolvedValue({
      attempt: {
        id: "att-1",
        status: "IN_PROGRESS",
        cheatCount: 0,
        expiredAt: "2026-01-01T12:00:00Z",
      },
      questions: [],
    });

    mockReportCheat.mockResolvedValue({
      message: "Tab berpindah",
      disqualified: false,
      attempt: { id: "att-1", cheatCount: 1, status: "BLOCKED" },
    });

    const { result } = renderHook(() => useExamSession());

    act(() => {
      result.current.actions.setSelectedSessionId("sess-1");
      result.current.actions.setAccessCode("123");
    });

    await act(async () => {
      await result.current.actions.handleJoin({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(result.current.state.examState).toBe("IN_PROGRESS");

    act(() => {
      window.dispatchEvent(new Event("blur"));
    });

    await act(async () => {
      jest.advanceTimersByTime(3500);
    });

    await waitFor(() => {
      expect(mockReportCheat).toHaveBeenCalledTimes(1);
      expect(result.current.state.examState).toBe("BLOCKED");
      expect(result.current.state.cheatCount).toBe(1);
    });
  });
});

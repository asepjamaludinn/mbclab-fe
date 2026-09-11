import { useState, useEffect, useRef, useCallback } from "react";
import { ExamAttempt, Question } from "../types/student-exam.type";
import {
  useJoinExam,
  useReportCheat,
  useSaveAnswer,
  useSubmitExam,
  useUnblockAttempt,
  useSyncAnswers,
} from "./use-student-exam";
import { examService } from "../services/student-exam.service";
import { showToast } from "@/shared/lib/toast";
import axios from "axios";

export type ExamState =
  | "SELECT_MODULE"
  | "RULES_AGREEMENT"
  | "ENTER_CODE"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "DISQUALIFIED"
  | "SUBMITTED";

export type AnswerOption = "A" | "B" | "C" | "D" | "E";
export type SaveStatus = "idle" | "saving" | "error" | "success";

const HIDDEN_GRACE_PERIOD_MS = 3000;
const QUICK_SWITCH_WINDOW_MS = 15000;
const QUICK_SWITCH_THRESHOLD = 3;

export function useExamSession() {
  const [examState, setExamState] = useState<ExamState>("SELECT_MODULE");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [timeLeft, setTimeLeft] = useState("--:--");
  const [unblockCode, setUnblockCode] = useState("");
  const [unblockError, setUnblockError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const cheatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResyncingRef = useRef(false);
  const isReportingCheatRef = useRef(false);

  const quickSwitchTimestampsRef = useRef<number[]>([]);

  const { mutateAsync: joinExam, isPending: isJoining } = useJoinExam();
  const { mutateAsync: saveAnswer } = useSaveAnswer();
  const { mutateAsync: submitExam, isPending: isSubmitting } = useSubmitExam();
  const { mutateAsync: reportCheat } = useReportCheat();
  const { mutateAsync: unblockAttempt, isPending: isUnblocking } =
    useUnblockAttempt();
  const { mutateAsync: syncAnswers } = useSyncAnswers();

  const restoreAnswers = useCallback(
    (
      savedAnswers?: { questionId: string; selectedOption: AnswerOption }[],
      currentAttemptId?: string,
      currentSessionId?: string,
    ) => {
      const restored: Record<string, AnswerOption> = {};

      if (savedAnswers && savedAnswers.length > 0) {
        savedAnswers.forEach((a) => {
          restored[a.questionId] = a.selectedOption;
        });
      }

      const pendingSync: {
        questionId: string;
        selectedOption: AnswerOption;
      }[] = [];

      if (currentAttemptId && currentSessionId) {
        const storageKey = `mbclab_exam_${currentAttemptId}`;
        try {
          const ls = localStorage.getItem(storageKey);
          if (ls) {
            const localAnswers: Record<string, AnswerOption> = JSON.parse(ls);
            for (const [qId, opt] of Object.entries(localAnswers)) {
              if (restored[qId] !== opt) {
                restored[qId] = opt;
                pendingSync.push({ questionId: qId, selectedOption: opt });
              }
            }
          }
        } catch (e) {
          console.error("Gagal membaca local storage", e);
        }

        localStorage.setItem(storageKey, JSON.stringify(restored));

        if (pendingSync.length > 0) {
          syncAnswers({
            sessionId: currentSessionId,
            answers: pendingSync,
          }).catch(() => console.warn("Background bulk sync failed"));
        }
      }

      setAnswers((prev) => ({ ...prev, ...restored }));
    },
    [syncAnswers],
  );

  const applyKnownErrorState = useCallback(
    (error: unknown, fallbackMsg: string): boolean => {
      if (!axios.isAxiosError(error)) return false;
      const errorMsg = String(
        error.response?.data?.message ?? "",
      ).toLowerCase();
      const status = error.response?.status;

      if (
        errorMsg.includes("melebihi batas") ||
        errorMsg.includes("disqualified") ||
        errorMsg.includes("diskualifikasi") ||
        errorMsg.includes("exceeded")
      ) {
        setStatusMessage(error.response?.data?.message ?? fallbackMsg);
        setExamState("DISQUALIFIED");
        return true;
      }

      if (
        status === 403 ||
        errorMsg.includes("blocked") ||
        errorMsg.includes("diblokir") ||
        errorMsg.includes("terblokir")
      ) {
        setStatusMessage(error.response?.data?.message ?? fallbackMsg);
        setExamState("BLOCKED");
        return true;
      }

      if (
        errorMsg.includes("sudah diselesaikan") ||
        errorMsg.includes("menyelesaikan ujian") ||
        errorMsg.includes("already completed") ||
        (errorMsg.includes("waktu") && errorMsg.includes("habis")) ||
        errorMsg.includes("waktu akses") ||
        errorMsg.includes("telah berakhir") ||
        errorMsg.includes("sudah tidak aktif")
      ) {
        setStatusMessage(error.response?.data?.message ?? fallbackMsg);
        setExamState("SUBMITTED");
        return true;
      }

      return false;
    },
    [],
  );

  const resyncAttemptState = useCallback(async () => {
    if (isResyncingRef.current || !selectedSessionId || !accessCode) return;
    isResyncingRef.current = true;
    try {
      const res = await joinExam({ sessionId: selectedSessionId, accessCode });
      setAttempt(res.attempt);
      setQuestions(res.questions);
      restoreAnswers(
        res.attempt.savedAnswers,
        res.attempt.id,
        selectedSessionId,
      );
      setExamState(res.attempt.status as ExamState);
    } catch (error) {
      const handled = applyKnownErrorState(
        error,
        "Status ujian Anda telah berubah. Silakan periksa kembali.",
      );
      if (!handled) {
        showToast.error(
          "Gagal Sinkronisasi",
          "Tidak dapat memverifikasi status ujian Anda. Silakan refresh halaman.",
        );
      }
    } finally {
      isResyncingRef.current = false;
    }
  }, [
    joinExam,
    selectedSessionId,
    accessCode,
    restoreAnswers,
    applyKnownErrorState,
  ]);

  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const doForceSubmit = async () => {
      try {
        await submitExam(selectedSessionId);
        setExamState("SUBMITTED");
        localStorage.removeItem(`mbclab_exam_${attempt.id}`);
      } catch (error) {
        const handled = applyKnownErrorState(error, "Waktu ujian telah habis.");
        if (!handled) {
          await resyncAttemptState();
        }
      }
    };

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiredAt = new Date(attempt.expiredAt).getTime();
      const distance = expiredAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        doForceSubmit();
      } else {
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(
          `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    examState,
    attempt,
    selectedSessionId,
    submitExam,
    applyKnownErrorState,
    resyncAttemptState,
  ]);

  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const executeCheatReport = async () => {
      if (isReportingCheatRef.current) return;
      isReportingCheatRef.current = true;

      try {
        const res = await reportCheat(selectedSessionId);
        setStatusMessage(res.message);

        if (res.disqualified) {
          setExamState("DISQUALIFIED");
          localStorage.removeItem(`mbclab_exam_${attempt.id}`);
          return;
        }
        setAttempt((prev) =>
          prev
            ? {
                ...prev,
                status: res.attempt.status,
                cheatCount: res.attempt.cheatCount,
              }
            : prev,
        );
        setExamState("BLOCKED");
      } catch (error) {
        console.error("Gagal merekam indikasi kecurangan:", error);

        const handled = applyKnownErrorState(
          error,
          "Terjadi perubahan status pada ujian Anda.",
        );

        if (!handled) {
          await resyncAttemptState();
        }
      } finally {
        isReportingCheatRef.current = false;
      }
    };

    const handleHidden = () => {
      if (cheatTimeoutRef.current) return;
      cheatTimeoutRef.current = setTimeout(() => {
        if (!document.hasFocus() || document.visibilityState === "hidden") {
          executeCheatReport();
        }
        cheatTimeoutRef.current = null;
      }, HIDDEN_GRACE_PERIOD_MS);
    };

    const handleVisible = () => {
      const wasQuickSwitch = !!cheatTimeoutRef.current;

      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
        cheatTimeoutRef.current = null;
      }

      if (!wasQuickSwitch) return;

      const now = Date.now();

      quickSwitchTimestampsRef.current = [
        ...quickSwitchTimestampsRef.current,
        now,
      ].filter((t) => now - t <= QUICK_SWITCH_WINDOW_MS);

      if (quickSwitchTimestampsRef.current.length >= QUICK_SWITCH_THRESHOLD) {
        quickSwitchTimestampsRef.current = [];
        executeCheatReport();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleHidden();
      } else {
        handleVisible();
      }
    };

    const handlePageHide = () => {
      if (examState === "IN_PROGRESS") {
        examService.reportCheatKeepAlive(selectedSessionId);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleHidden);
    window.addEventListener("focus", handleVisible);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleHidden);
      window.removeEventListener("focus", handleVisible);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
        cheatTimeoutRef.current = null;
      }
    };
  }, [
    examState,
    attempt,
    selectedSessionId,
    reportCheat,
    applyKnownErrorState,
    resyncAttemptState,
  ]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");

    if (!selectedSessionId || !accessCode) {
      setJoinError("Kode Akses wajib diisi.");
      return;
    }

    try {
      const res = await joinExam({ sessionId: selectedSessionId, accessCode });

      setAttempt(res.attempt);
      setQuestions(res.questions);
      restoreAnswers(
        res.attempt.savedAnswers,
        res.attempt.id,
        selectedSessionId,
      );
      setExamState(res.attempt.status as ExamState);

      quickSwitchTimestampsRef.current = [];
    } catch (error: unknown) {
      const handled = applyKnownErrorState(error, "Gagal masuk ke sesi ujian.");
      if (!handled) {
        if (axios.isAxiosError(error)) {
          setJoinError(
            error.response?.data?.message || "Gagal masuk ke sesi ujian.",
          );
        } else {
          setJoinError("Gagal masuk ke sesi ujian.");
        }
      }
    }
  };

  const handleSelectAnswer = useCallback(
    async (questionId: string, option: AnswerOption, retryCount = 0) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: option };
        if (attempt?.id) {
          localStorage.setItem(
            `mbclab_exam_${attempt.id}`,
            JSON.stringify(next),
          );
        }
        return next;
      });

      setSaveStatus("saving");

      try {
        await saveAnswer({
          sessionId: selectedSessionId,
          questionId,
          selectedOption: option,
        });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 1500);
      } catch (error) {
        const handled = applyKnownErrorState(
          error,
          "Terjadi perubahan status pada ujian Anda.",
        );
        if (handled) return;

        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 500;
          setTimeout(
            () => handleSelectAnswer(questionId, option, retryCount + 1),
            delay,
          );
        } else {
          setSaveStatus("error");
        }
      }
    },
    [selectedSessionId, saveAnswer, applyKnownErrorState, attempt?.id],
  );

  const handleManualSubmit = async () => {
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
      if (attempt?.id) {
        localStorage.removeItem(`mbclab_exam_${attempt.id}`);
      }
    } catch (error: unknown) {
      const handled = applyKnownErrorState(error, "Gagal menyelesaikan ujian.");
      if (!handled) {
        if (axios.isAxiosError(error)) {
          showToast.error(
            "Gagal Submit",
            error.response?.data?.message || "Gagal menyelesaikan ujian.",
          );
        } else {
          showToast.error("Gagal Submit", "Gagal menyelesaikan ujian.");
        }
      }
    }
  };

  const handleUnblock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnblockError("");
    try {
      const res = await unblockAttempt({
        sessionId: selectedSessionId,
        code: unblockCode,
      });

      setAttempt(res.attempt);
      setQuestions(res.questions);
      restoreAnswers(
        res.attempt.savedAnswers,
        res.attempt.id,
        selectedSessionId,
      );
      setExamState("IN_PROGRESS");
      setUnblockCode("");
      setStatusMessage("");

      quickSwitchTimestampsRef.current = [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Kode unblock tidak valid.";
        setUnblockError(message);

        if (
          String(message).toLowerCase().includes("diakhiri") ||
          String(message).toLowerCase().includes("diskualifikasi") ||
          String(message).toLowerCase().includes("disqualified")
        ) {
          setStatusMessage(message);
          setExamState("DISQUALIFIED");
        }
      } else {
        setUnblockError("Kode unblock tidak valid.");
      }
    }
  };

  return {
    state: {
      examState,
      attemptId: attempt?.id,
      selectedSessionId,
      accessCode,
      joinError,
      questions,
      currentIdx,
      answers,
      timeLeft,
      unblockCode,
      unblockError,
      isJoining,
      isSubmitting,
      isUnblocking,
      statusMessage,
      saveStatus,
      cheatCount: attempt?.cheatCount ?? 0,
    },
    actions: {
      setExamState,
      setSelectedSessionId,
      setAccessCode,
      setUnblockCode,
      setCurrentIdx,
      handleJoin,
      handleSelectAnswer,
      handleManualSubmit,
      handleUnblock,
    },
  };
}

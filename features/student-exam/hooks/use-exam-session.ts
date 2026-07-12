import { useState, useEffect, useRef, useCallback } from "react";
import { ExamAttempt, Question } from "../types/student-exam.type";
import {
  useJoinExam,
  useReportCheat,
  useSaveAnswer,
  useSubmitExam,
  useUnblockAttempt,
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

  const { mutateAsync: joinExam, isPending: isJoining } = useJoinExam();
  const { mutateAsync: saveAnswer } = useSaveAnswer();
  const { mutateAsync: submitExam, isPending: isSubmitting } = useSubmitExam();
  const { mutateAsync: reportCheat } = useReportCheat();
  const { mutateAsync: unblockAttempt, isPending: isUnblocking } =
    useUnblockAttempt();

  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiredAt = new Date(attempt.expiredAt).getTime();
      const distance = expiredAt - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        handleForceSubmit();
      } else {
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(
          `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [examState, attempt]);

  useEffect(() => {
    if (examState !== "IN_PROGRESS" || !attempt) return;

    const executeCheatReport = async () => {
      try {
        const res = await reportCheat(selectedSessionId);

        setStatusMessage(res.message);

        if (res.disqualified) {
          setExamState("DISQUALIFIED");
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
      }
    };

    const handleHidden = () => {
      if (cheatTimeoutRef.current) return;

      cheatTimeoutRef.current = setTimeout(() => {
        executeCheatReport();
        cheatTimeoutRef.current = null;
      }, 3000);
    };

    const handleVisible = () => {
      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
        cheatTimeoutRef.current = null;
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

    window.addEventListener("blur", handleHidden);
    window.addEventListener("focus", handleVisible);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("blur", handleHidden);
      window.removeEventListener("focus", handleVisible);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      if (cheatTimeoutRef.current) {
        clearTimeout(cheatTimeoutRef.current);
        cheatTimeoutRef.current = null;
      }
    };
  }, [examState, attempt, selectedSessionId, reportCheat]);

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
      setExamState(res.attempt.status as ExamState);
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 403 &&
        String(error.response.data?.message).includes("diblokir")
      ) {
        setExamState("BLOCKED");
      } else if (
        axios.isAxiosError(error) &&
        String(error.response?.data?.message).includes("melebihi batas")
      ) {
        setStatusMessage(error.response?.data?.message ?? "");
        setExamState("DISQUALIFIED");
      } else if (axios.isAxiosError(error)) {
        setJoinError(
          error.response?.data?.message || "Gagal masuk ke sesi ujian.",
        );
      } else {
        setJoinError("Gagal masuk ke sesi ujian.");
      }
    }
  };

  const handleSelectAnswer = useCallback(
    async (questionId: string, option: AnswerOption, retryCount = 0) => {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
      setSaveStatus("saving");

      try {
        await saveAnswer({
          sessionId: selectedSessionId,
          questionId,
          selectedOption: option,
        });
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(
            () => handleSelectAnswer(questionId, option, retryCount + 1),
            delay,
          );
        } else {
          setSaveStatus("error");
        }
      }
    },
    [selectedSessionId, saveAnswer],
  );

  const handleForceSubmit = async () => {
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error) {
      setExamState("SUBMITTED");
    }
  };

  const handleManualSubmit = async () => {
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showToast.error(
          "Gagal Submit",
          error.response?.data?.message || "Gagal menyelesaikan ujian.",
        );
      } else {
        showToast.error("Gagal Submit", "Gagal menyelesaikan ujian.");
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
      setExamState("IN_PROGRESS");
      setUnblockCode("");
      setStatusMessage("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Kode unblock tidak valid.";
        setUnblockError(message);

        if (String(message).includes("diakhiri")) {
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

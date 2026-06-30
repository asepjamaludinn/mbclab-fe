import { useState, useEffect } from "react";
import { ExamAttempt, Question } from "../types/student-exam.type";
import {
  useJoinExam,
  useReportCheat,
  useSaveAnswer,
  useSubmitExam,
  useUnblockAttempt,
} from "./use-student-exam";
import axios from "axios";

export type ExamState =
  | "SELECT_MODULE"
  | "ENTER_CODE"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "SUBMITTED";
export type AnswerOption = "A" | "B" | "C" | "D" | "E";

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

    const handleBlur = async () => {
      try {
        const res = await reportCheat(selectedSessionId);
        setAttempt(res.attempt);
        setExamState("BLOCKED");
      } catch (error) {
        console.error("Gagal merekam indikasi kecurangan:", error);
      }
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [examState, attempt, selectedSessionId, reportCheat]);

  // Handlers
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
      } else if (axios.isAxiosError(error)) {
        setJoinError(
          error.response?.data?.message || "Gagal masuk ke sesi ujian.",
        );
      } else {
        setJoinError("Gagal masuk ke sesi ujian.");
      }
    }
  };

  const handleSelectAnswer = async (
    questionId: string,
    option: AnswerOption,
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    try {
      await saveAnswer({
        sessionId: selectedSessionId,
        questionId,
        selectedOption: option,
      });
    } catch (error) {
      console.error("Gagal menyimpan jawaban:", error);
    }
  };

  const handleForceSubmit = async () => {
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error) {
      setExamState("SUBMITTED");
    }
  };

  const handleManualSubmit = async () => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban tidak dapat diubah lagi.",
      )
    )
      return;
    try {
      await submitExam(selectedSessionId);
      setExamState("SUBMITTED");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyelesaikan ujian.");
      } else {
        alert("Gagal menyelesaikan ujian.");
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
      setExamState("IN_PROGRESS");
      setUnblockCode("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setUnblockError(
          error.response?.data?.message || "Kode unblock tidak valid.",
        );
      } else {
        setUnblockError("Kode unblock tidak valid.");
      }
    }
  };

  return {
    state: {
      examState,
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

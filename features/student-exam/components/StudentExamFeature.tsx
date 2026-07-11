"use client";

import { useStudentModules } from "@/features/student-modules";
import {
  useMyExamSessions,
  useMyExamAttempts,
} from "../hooks/use-student-exam";
import { useExamSession } from "../hooks/use-exam-session";
import { ExamSelectModule } from "../views/ExamSelectModule";
import { ExamRules } from "../views/ExamRules";
import { ExamEnterCode } from "../views/ExamEnterCode";
import { ExamInProgress } from "../views/ExamInProgress";
import { ExamBlocked } from "../views/ExamBlocked";
import { ExamDisqualified } from "../views/ExamDisqualified";
import { ExamSubmitted } from "../views/ExamSubmitted";

export function StudentExamFeature() {
  const { data: modulesRes, isLoading: isModulesLoading } = useStudentModules(
    1,
    100,
  );
  const { data: mySessions = [], isLoading: isSessionsLoading } =
    useMyExamSessions();
  const { data: myAttempts = [], isLoading: isAttemptsLoading } =
    useMyExamAttempts();

  const isLoadingData =
    isModulesLoading || isSessionsLoading || isAttemptsLoading;

  const { state, actions } = useExamSession();

  switch (state.examState) {
    case "SELECT_MODULE":
      return (
        <ExamSelectModule
          modules={modulesRes?.data || []}
          mySessions={mySessions}
          myAttempts={myAttempts}
          isLoadingData={isLoadingData}
          onSelectSession={(id) => {
            actions.setSelectedSessionId(id);
            actions.setExamState("RULES_AGREEMENT");
          }}
        />
      );

    case "RULES_AGREEMENT":
      return (
        <ExamRules
          onAgree={() => actions.setExamState("ENTER_CODE")}
          onCancel={() => actions.setExamState("SELECT_MODULE")}
        />
      );

    case "ENTER_CODE":
      return (
        <ExamEnterCode
          accessCode={state.accessCode}
          setAccessCode={actions.setAccessCode}
          joinError={state.joinError}
          isJoining={state.isJoining}
          onJoin={actions.handleJoin}
          onCancel={() => actions.setExamState("SELECT_MODULE")}
        />
      );

    case "IN_PROGRESS":
      return (
        <ExamInProgress
          questions={state.questions}
          currentIdx={state.currentIdx}
          answers={state.answers}
          timeLeft={state.timeLeft}
          isSubmitting={state.isSubmitting}
          saveStatus={state.saveStatus}
          setCurrentIdx={actions.setCurrentIdx}
          onSelectAnswer={actions.handleSelectAnswer}
          onManualSubmit={actions.handleManualSubmit}
        />
      );

    case "BLOCKED":
      return (
        <ExamBlocked
          unblockCode={state.unblockCode}
          setUnblockCode={actions.setUnblockCode}
          unblockError={state.unblockError}
          isUnblocking={state.isUnblocking}
          onUnblock={actions.handleUnblock}
          statusMessage={state.statusMessage}
          cheatCount={state.cheatCount}
        />
      );

    case "DISQUALIFIED":
      return <ExamDisqualified message={state.statusMessage} />;

    case "SUBMITTED":
      return <ExamSubmitted />;

    default:
      return null;
  }
}

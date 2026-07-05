"use client";

import { useStudentModules } from "@/features/student-modules";
import { useMyExamSessions } from "../hooks/use-student-exam";
import { useExamSession } from "../hooks/use-exam-session";
import { ExamSelectModule } from "../views/ExamSelectModule";
import { ExamEnterCode } from "../views/ExamEnterCode";
import { ExamInProgress } from "../views/ExamInProgress";
import { ExamBlocked } from "../views/ExamBlocked";
import { ExamDisqualified } from "../views/ExamDisqualified";
import { ExamSubmitted } from "../views/ExamSubmitted";

export function StudentExamFeature() {
  const { data: modulesRes, isLoading: isModulesLoading } = useStudentModules();
  const { data: mySessions = [], isLoading: isSessionsLoading } =
    useMyExamSessions();
  const isLoadingData = isModulesLoading || isSessionsLoading;

  const { state, actions } = useExamSession();

  switch (state.examState) {
    case "SELECT_MODULE":
      return (
        <ExamSelectModule
          modules={modulesRes?.data || []}
          mySessions={mySessions}
          isLoadingData={isLoadingData}
          onSelectSession={(id) => {
            actions.setSelectedSessionId(id);
            actions.setExamState("ENTER_CODE");
          }}
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

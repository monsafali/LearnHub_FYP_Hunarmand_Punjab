import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useCourseLearning } from "../../hooks/student/useCourseLearning";
import { useCourseAssignments } from "../../hooks/student/useCourseAssignments";

import { CourseHeader } from "../../components/student/CourseHeader";
import { CourseTabs } from "../../components/student/CourseTabs";
import { LectureSidebar } from "../../components/student/LectureSidebar";
import { LecturePanel } from "../../components/student/LecturePanel";
import { AssignmentsPanel } from "../../components/student/AssignmentsPanel";
import { SubmitAssignmentModal } from "../../components/student/modals/SubmitAssignmentModal";
import { AssignmentResultModal } from "../../components/student/modals/AssignmentResultModal";

const StudentCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("content");

  const {
    selectedCourse,
    lessons,
    loading,
    error,
    selectedLesson,
    selectLesson,
    sidebarOpen,
    toggleSidebar,
  } = useCourseLearning(courseId, () => navigate("/student/lms"));

  const assignmentsHook = useCourseAssignments(courseId);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "assignments" && !assignmentsHook.loaded) {
      assignmentsHook.loadAssignments();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedCourse) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button
            onClick={() => navigate("/student/lms")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to LMS
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <CourseHeader
        course={selectedCourse}
        lectureCount={lessons.length}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
        onBack={() => navigate("/student/lms")}
      />

      <CourseTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        assignmentCount={assignmentsHook.assignments.length}
      />

      {activeTab === "content" ? (
        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
          <LectureSidebar
            lessons={lessons}
            selectedLesson={selectedLesson}
            onSelect={selectLesson}
            sidebarOpen={sidebarOpen}
          />

          <main className="min-w-0 flex-1">
            <LecturePanel lesson={selectedLesson} lessons={lessons} />
          </main>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl bg-white">
          <AssignmentsPanel
            assignments={assignmentsHook.assignments}
            loading={assignmentsHook.assignmentsLoading}
            onSubmit={assignmentsHook.openSubmitModal}
            onViewResult={assignmentsHook.openResult}
          />
        </div>
      )}

      {assignmentsHook.showSubmitModal && (
        <SubmitAssignmentModal
          assignment={assignmentsHook.activeAssignment}
          onClose={assignmentsHook.closeSubmitModal}
          onSubmit={assignmentsHook.handleSubmitAssignment}
          file={assignmentsHook.submissionFile}
          setFile={assignmentsHook.setSubmissionFile}
          loading={assignmentsHook.submissionLoading}
        />
      )}

      {assignmentsHook.showResultModal && (
        <AssignmentResultModal
          assignment={assignmentsHook.resultAssignment}
          result={assignmentsHook.assignmentResult}
          loading={assignmentsHook.resultLoading}
          onClose={assignmentsHook.closeResult}
        />
      )}
    </div>
  );
};

export default StudentCourse;

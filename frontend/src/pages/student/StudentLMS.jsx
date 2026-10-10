import { useEffect, useMemo, useState } from "react";
import { BookOpen, Menu } from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import useStudentStore from "../../store/studentStore";
import useChatStore from "../../store/chatStore";
import { EnrolledCourseCard } from "../../components/student/EnrolledCourseCard";
import { EmptyCoursesState } from "../../components/student/EmptyCoursesState";
import StudentSidebar from "../../components/student/StudentSidebar";
import StudentChat from "../../components/student/StudentChat";
import { LectureSidebar } from "../../components/student/LectureSidebar";
import { LecturePanel } from "../../components/student/LecturePanel";
import { AssignmentsPanel } from "../../components/student/AssignmentsPanel";
import { SubmitAssignmentModal } from "../../components/student/modals/SubmitAssignmentModal";
import { AssignmentResultModal } from "../../components/student/modals/AssignmentResultModal";
import { useCourseAssignments } from "../../hooks/student/useCourseAssignments";

const VIEW_META = {
  courses: ["My courses", "Pick up where you left off."],
  content: ["Course content", "Work through the lessons in your selected course."],
  assignments: ["Assignments", "Review deadlines, submit your work, and view results."],
  chat: ["Course chat", "Ask questions and connect with your classmates."],
};

const StudentLMS = () => {
  const user = useAuthStore((state) => state.user);
  const enrolledCourses = useStudentStore((state) => state.enrolledCourses);
  const loadingCourses = useStudentStore((state) => state.loading);
  const getMyCourses = useStudentStore((state) => state.getMyCourses);
  const getMyCourseWithLessons = useStudentStore((state) => state.getMyCourseWithLessons);
  const selectedCourse = useStudentStore((state) => state.selectedCourse);
  const lessons = useStudentStore((state) => state.lessons);
  const [activeView, setActiveView] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const chatCourse = useChatStore((state) => state.selectedCourse);
  const chatCourses = useChatStore((state) => state.courses);
  const selectChatCourse = useChatStore((state) => state.selectCourse);
  const fetchChatCourses = useChatStore((state) => state.fetchCourses);

  const assignments = useCourseAssignments(selectedCourse?._id);
  const selectedCourseId = selectedCourse?._id;
  const assignmentsLoaded = assignments.loaded;
  const loadAssignments = assignments.loadAssignments;
  const coursesForChat = useMemo(() => chatCourses.length ? chatCourses : enrolledCourses.map((item) => item.course).filter(Boolean), [chatCourses, enrolledCourses]);

  useEffect(() => {
    getMyCourses();
    fetchChatCourses();
  }, [getMyCourses, fetchChatCourses]);

  useEffect(() => {
    if (lessons.length) setSelectedLesson(lessons[0]);
    else setSelectedLesson(null);
  }, [lessons, selectedCourse?._id]);

  useEffect(() => {
    if (activeView === "assignments" && selectedCourseId && !assignmentsLoaded) {
      loadAssignments();
    }
  }, [activeView, selectedCourseId, assignmentsLoaded, loadAssignments]);

  const goTo = (view) => {
    if (view !== "courses" && !selectedCourse) {
      toast("Choose a course first");
      return;
    }
    if (view === "chat" && !chatCourse && coursesForChat[0]) {
      selectChatCourse(coursesForChat[0]);
    }
    setActiveView(view);
    setSidebarOpen(false);
  };

  const openCourse = async (courseId) => {
    setContentLoading(true);
    const result = await getMyCourseWithLessons(courseId);
    setContentLoading(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setSelectedLesson(result.lessons?.[0] || null);
    setActiveView("content");
    setSidebarOpen(false);
  };

  return <div className="min-h-screen bg-slate-50">
    <StudentSidebar activeView={activeView} goTo={goTo} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} courseCount={enrolledCourses.length} />
    {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

    <div className="min-h-screen lg:pl-72">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"><Menu size={21} /></button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold text-slate-900">{VIEW_META[activeView][0]}</h1>
            <p className="mt-0.5 truncate text-sm text-slate-500">{VIEW_META[activeView][1]}</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right"><p className="text-sm font-semibold text-slate-800">{user?.fullname || "Student"}</p><p className="text-xs text-slate-500">Student</p></div>
            {user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{(user?.fullname || "S").split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase()}</div>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {activeView === "courses" && <>
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-indigo-600">Your learning space</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Continue learning</h2></div><div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"><BookOpen size={16} className="mr-2 inline" />{enrolledCourses.length} courses</div></div>
          {loadingCourses && <div className="py-20 text-center text-slate-500">Loading your courses...</div>}
          {!loadingCourses && enrolledCourses.length === 0 && <EmptyCoursesState />}
          {!loadingCourses && enrolledCourses.length > 0 && <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{enrolledCourses.map((enrollment) => <EnrolledCourseCard key={enrollment._id} enrollment={enrollment} onContinue={openCourse} />)}</div>}
        </>}

        {activeView === "content" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Selected course</p><div className="mt-1 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold text-slate-900">{selectedCourse?.name || "Choose a course"}</h2><select value={selectedCourse?._id || ""} onChange={(event) => openCourse(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400">{enrolledCourses.map(({ course }) => course && <option key={course._id} value={course._id}>{course.name}</option>)}</select></div></div>
          {contentLoading ? <div className="p-16 text-center text-slate-500">Loading course content...</div> : selectedCourse && <div className="flex flex-col lg:flex-row"><LectureSidebar lessons={lessons} selectedLesson={selectedLesson} onSelect={setSelectedLesson} sidebarOpen /><div className="min-w-0 flex-1"><LecturePanel lesson={selectedLesson} lessons={lessons} /></div></div>}
        </section>}

        {activeView === "assignments" && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Coursework</p><h2 className="mt-1 text-xl font-bold text-slate-900">{selectedCourse?.name}</h2></div><select value={selectedCourse?._id || ""} onChange={(event) => openCourse(event.target.value).then(() => setActiveView("assignments"))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400">{enrolledCourses.map(({ course }) => course && <option key={course._id} value={course._id}>{course.name}</option>)}</select></div><AssignmentsPanel assignments={assignments.assignments} loading={assignments.assignmentsLoading} onSubmit={assignments.openSubmitModal} onViewResult={assignments.openResult} /></section>}

        {activeView === "chat" && <StudentChat />}
      </main>
    </div>

    {assignments.showSubmitModal && <SubmitAssignmentModal assignment={assignments.activeAssignment} onClose={assignments.closeSubmitModal} onSubmit={assignments.handleSubmitAssignment} file={assignments.submissionFile} setFile={assignments.setSubmissionFile} loading={assignments.submissionLoading} />}
    {assignments.showResultModal && <AssignmentResultModal assignment={assignments.resultAssignment} result={assignments.assignmentResult} loading={assignments.resultLoading} onClose={assignments.closeResult} />}
  </div>;
};

export default StudentLMS;

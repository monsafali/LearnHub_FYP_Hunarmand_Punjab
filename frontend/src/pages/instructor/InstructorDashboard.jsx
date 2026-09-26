import { useEffect, useMemo, useState } from "react";

import useAuthStore from "../../store/authStore";
import { useCourseManager } from "../../hooks/instructor/useCourseManager";
import { useLessonManager } from "../../hooks/instructor/useLessonManager";
import { useAssignmentManager } from "../../hooks/instructor/useAssignmentManager";
import { useStudentsView } from "../../hooks/instructor/useStudentsView";

import { Sidebar } from "../../components/instructor/Sidebar";
import { TopBar } from "../../components/instructor/TopBar";
import { CoursesView } from "../../components/instructor/CoursesView";
import { StudentsView } from "../../components/instructor/StudentsView";
import { AssignmentsView } from "../../components/instructor/AssignmentsView";

import { CreateCourseModal } from "../../components/instructor/modals/CreateCourseModal";
import { EditCourseModal } from "../../components/instructor/modals/EditCourseModal";
import { LessonModal } from "../../components/instructor/modals/LessonModal";
import { AssignmentModal } from "../../components/instructor/modals/AssignmentModal";
import { SubmissionsModal } from "../../components/instructor/modals/SubmissionsModal";

const PAGE_META = {
  courses: { title: "My courses", subtitle: "Create, edit and add lessons to your courses" },
  assignments: { title: "Assignments", subtitle: "Publish assignments and grade submissions" },
  students: { title: "Students", subtitle: "See who is enrolled in each course" },
};

const InstructorDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [activeView, setActiveView] = useState("courses");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const courseManager = useCourseManager();
  const lessonManager = useLessonManager();
  const assignmentManager = useAssignmentManager();
  const studentsView = useStudentsView();

  useEffect(() => {
    courseManager.getCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const instructorCourses = useMemo(() => {
    if (!user) return [];
    return courseManager.courses.filter((course) => {
      const trainerId = typeof course.trainer === "object" ? course.trainer?._id : course.trainer;
      return trainerId === user._id;
    });
  }, [courseManager.courses, user]);

  const categories = useMemo(() => {
    const byCategory = instructorCourses.reduce((acc, c) => {
      const key = c.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(byCategory);
  }, [instructorCourses]);

  const categoryOptions = useMemo(() => ["All", ...categories], [categories]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return instructorCourses.filter((course) => {
      const matchesSearch =
        !q ||
        course.name?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === "All" || course.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [instructorCourses, search, categoryFilter]);

  const goTo = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const handleDeleteCourse = async (course) => {
    const deletedId = await courseManager.handleDeleteCourse(course);
    if (deletedId) studentsView.clearIfDeleted(deletedId);
  };

  const openStudents = (course) => {
    goTo("students");
    studentsView.loadStudents(course._id);
  };

  const addAssignmentFromCourseCard = (course) => {
    assignmentManager.openAssignmentModal(course);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        activeView={activeView}
        goTo={goTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        courseCount={instructorCourses.length}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <TopBar
          title={PAGE_META[activeView].title}
          subtitle={PAGE_META[activeView].subtitle}
          user={user}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="mx-auto max-w-7xl p-4 md:p-8">
          {activeView === "courses" && (
            <CoursesView
              instructorCourses={instructorCourses}
              filteredCourses={filteredCourses}
              search={search}
              setSearch={setSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categoryOptions={categoryOptions}
              loading={courseManager.loading}
              onRefresh={courseManager.getCourses}
              onCreate={courseManager.openCreateCourse}
              onAddLesson={lessonManager.openLessonModal}
              onAddAssignment={addAssignmentFromCourseCard}
              onViewStudents={openStudents}
              onEdit={courseManager.openEditCourse}
              onDelete={handleDeleteCourse}
            />
          )}

          {activeView === "assignments" && (
            <AssignmentsView
              instructorCourses={instructorCourses}
              assignmentsCourseId={assignmentManager.assignmentsCourseId}
              loadAssignments={assignmentManager.loadAssignments}
              assignments={assignmentManager.assignments}
              assignmentsLoading={assignmentManager.assignmentsLoading}
              onAddAssignment={assignmentManager.openAssignmentModal}
              onViewSubmissions={assignmentManager.openSubmissions}
            />
          )}

          {activeView === "students" && (
            <StudentsView
              instructorCourses={instructorCourses}
              studentsCourseId={studentsView.studentsCourseId}
              loadStudents={studentsView.loadStudents}
              studentsLoading={studentsView.studentsLoading}
              students={studentsView.students}
            />
          )}
        </main>
      </div>

      {courseManager.showCreateCourse && (
        <CreateCourseModal
          onClose={courseManager.closeCreateCourse}
          onSubmit={courseManager.handleCreateCourse}
          courseForm={courseManager.courseForm}
          onChange={courseManager.handleCourseChange}
          courseImage={courseManager.courseImage}
          setCourseImage={courseManager.setCourseImage}
          loading={courseManager.loading}
        />
      )}

      {courseManager.showEditCourse && (
        <EditCourseModal
          course={courseManager.selectedCourse}
          onClose={courseManager.closeEditCourse}
          onSubmit={courseManager.handleUpdateCourse}
          courseForm={courseManager.courseForm}
          onChange={courseManager.handleCourseChange}
          loading={courseManager.loading}
        />
      )}

      {lessonManager.showLessonModal && (
        <LessonModal
          course={lessonManager.selectedCourse}
          onClose={lessonManager.closeLessonModal}
          onSubmit={lessonManager.handleCreateLesson}
          lessonForm={lessonManager.lessonForm}
          onChange={lessonManager.handleLessonChange}
          lessonVideo={lessonManager.lessonVideo}
          setLessonVideo={lessonManager.setLessonVideo}
          loading={lessonManager.loading}
        />
      )}

      {assignmentManager.showAssignmentModal && (
        <AssignmentModal
          course={assignmentManager.assignmentCourse}
          onClose={assignmentManager.closeAssignmentModal}
          onSubmit={assignmentManager.handleCreateAssignment}
          assignmentForm={assignmentManager.assignmentForm}
          onChange={assignmentManager.handleAssignmentChange}
          assignmentFile={assignmentManager.assignmentFile}
          setAssignmentFile={assignmentManager.setAssignmentFile}
          loading={assignmentManager.assignmentsLoading}
        />
      )}

      {assignmentManager.showSubmissionsModal && (
        <SubmissionsModal
          assignment={assignmentManager.activeAssignment}
          submissions={assignmentManager.submissions}
          submissionsLoading={assignmentManager.submissionsLoading}
          gradingId={assignmentManager.gradingId}
          gradeForm={assignmentManager.gradeForm}
          onGradeChange={assignmentManager.handleGradeChange}
          onStartGrading={assignmentManager.startGrading}
          onSubmitGrade={assignmentManager.submitGrade}
          onClose={assignmentManager.closeSubmissions}
        />
      )}
    </div>
  );
};

export default InstructorDashboard;

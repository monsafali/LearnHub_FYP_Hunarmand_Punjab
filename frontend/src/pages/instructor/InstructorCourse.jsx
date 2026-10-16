import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Pencil, Plus, Trash2, Trash } from "lucide-react";
import useInstructorStore from "../../store/instructorStore";
import { CourseHeader } from "../../components/student/CourseHeader";
import { CourseTabs } from "../../components/student/CourseTabs";
import { LectureSidebar } from "../../components/student/LectureSidebar";
import { LecturePanel } from "../../components/student/LecturePanel";
import { AssignmentsPanel } from "../../components/student/AssignmentsPanel";
import { LessonModal } from "../../components/instructor/modals/LessonModal";
import { AssignmentModal } from "../../components/instructor/modals/AssignmentModal";
import { Field, Modal } from "../../components/ui/Modal";

const InstructorCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getInstructorCourseContent, updateLesson, deleteLesson, updateAssignment, deleteAssignment, createLesson, createAssignment, getAssignmentSubmissions, deleteCourse } = useInstructorStore();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [lessonModal, setLessonModal] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: "" });
  const [lessonVideo, setLessonVideo] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", totalMarks: "", dueDate: "" });
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [submissionState, setSubmissionState] = useState({ assignment: null, submissions: [], loading: false });

  const refresh = useCallback(async () => {
    const result = await getInstructorCourseContent(courseId);
    if (!result.success) { toast.error(result.message); navigate("/instructor/dashboard"); return; }
    setCourse(result.course); setLessons(result.lessons || []); setAssignments(result.assignments || []);
    setSelectedLesson((current) => (result.lessons || []).find((lesson) => lesson._id === current?._id) || result.lessons?.[0] || null);
  }, [courseId, getInstructorCourseContent, navigate]);
  useEffect(() => { refresh(); }, [refresh]);

  const openNewLesson = () => { setEditingLesson(null); setLessonForm({ title: "" }); setLessonVideo(null); setLessonModal(true); };
  const openEditLesson = (lesson) => { setEditingLesson(lesson); setLessonForm({ title: lesson.title }); setLessonVideo(null); setLessonModal(true); };
  const saveLesson = async (event) => {
    event.preventDefault(); setBusy(true);
    if (!editingLesson && !lessonVideo) {
      setBusy(false);
      toast.error("Please choose a lecture video to upload");
      return;
    }
    const data = new FormData(); data.append("title", lessonForm.title); if (lessonVideo) data.append("video", lessonVideo);
    const result = editingLesson ? await updateLesson(editingLesson._id, data) : await createLesson(courseId, data);
    setBusy(false); if (!result.success) return toast.error(result.message);
    toast.success(result.message); setLessonModal(false); await refresh();
  };
  const removeLesson = async (lesson) => {
    if (!window.confirm(`Delete lecture “${lesson.title}”?`)) return;
    const result = await deleteLesson(lesson._id); if (!result.success) return toast.error(result.message);
    toast.success(result.message); await refresh();
  };
  const openNewAssignment = () => { setEditingAssignment(null); setAssignmentForm({ title: "", description: "", totalMarks: "", dueDate: "" }); setAssignmentFile(null); setAssignmentModal(true); };
  const openEditAssignment = (assignment) => { setEditingAssignment(assignment); setAssignmentForm({ title: assignment.title, description: assignment.description || "", totalMarks: assignment.totalMarks, dueDate: assignment.dueDate ? assignment.dueDate.slice(0, 10) : "" }); setAssignmentFile(null); setAssignmentModal(true); };
  const saveAssignment = async (event) => {
    event.preventDefault(); setBusy(true);
    const data = new FormData(); Object.entries(assignmentForm).forEach(([key, value]) => data.append(key, value)); if (assignmentFile) data.append("assignment", assignmentFile);
    const result = editingAssignment ? await updateAssignment(editingAssignment._id, data) : await createAssignment(courseId, data);
    setBusy(false); if (!result.success) return toast.error(result.message);
    toast.success(result.message); setAssignmentModal(false); await refresh();
  };
  const removeAssignment = async (assignment) => {
    if (!window.confirm(`Delete assignment “${assignment.title}” and its submissions?`)) return;
    const result = await deleteAssignment(assignment._id); if (!result.success) return toast.error(result.message);
    toast.success(result.message); await refresh();
  };
  const viewSubmissions = async (assignment) => {
    setSubmissionState({ assignment, submissions: [], loading: true });
    const result = await getAssignmentSubmissions(assignment._id);
    setSubmissionState({ assignment, submissions: result.submissions || [], loading: false });
    if (!result.success) toast.error(result.message);
  };
  const removeCourse = async () => {
    if (!window.confirm(`Delete “${course.name}” and all of its lectures, assignments, and enrollment records? This cannot be undone.`)) return;
    setBusy(true);
    const result = await deleteCourse(course._id);
    setBusy(false);
    if (!result.success) return toast.error(result.message);
    toast.success(result.message || "Course deleted");
    navigate("/instructor/dashboard");
  };

  if (!course) return <div className="p-10 text-center text-slate-500">Loading course...</div>;
  return <div className="min-h-screen bg-gray-100">
    <CourseHeader course={course} lectureCount={lessons.length} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((value) => !value)} onBack={() => navigate("/instructor/dashboard")} />
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 pt-4"><button onClick={() => navigate("/instructor/dashboard")} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700"><ArrowLeft size={16} /> Back to teaching overview</button><button disabled={busy} onClick={removeCourse} className="flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"><Trash size={16} /> Delete course</button></div>
    <CourseTabs activeTab={activeTab} onChange={setActiveTab} assignmentCount={assignments.length} />
    {activeTab === "content" ? <>
      <div className="mx-auto flex max-w-[1600px] justify-end px-4 py-3"><button onClick={openNewLesson} className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus size={17} /> Add lecture</button></div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row">
      <div className="lg:sticky lg:top-0 lg:h-[calc(100vh-145px)] lg:overflow-y-auto"><LectureSidebar lessons={lessons} selectedLesson={selectedLesson} onSelect={setSelectedLesson} sidebarOpen={sidebarOpen} /></div>
      <main className="min-w-0 flex-1">
        {selectedLesson && <div className="flex justify-end gap-2 bg-white px-4 pt-3"><button onClick={() => openEditLesson(selectedLesson)} className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm"><Pencil size={14} /> Edit lecture</button><button onClick={() => removeLesson(selectedLesson)} className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm text-rose-600"><Trash2 size={14} /> Delete lecture</button></div>}
        <LecturePanel lesson={selectedLesson} lessons={lessons} />
      </main>
      </div>
    </> : <div className="mx-auto max-w-5xl space-y-4 px-5 py-6">
      <div className="flex justify-end"><button onClick={openNewAssignment} className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white"><Plus size={16} /> Add assignment</button></div>
      {assignments.length === 0 ? <div className="rounded-xl bg-white p-12 text-center text-slate-500">No assignments yet. Add one for your students.</div> : assignments.map((assignment) => <article key={assignment._id} className="rounded-xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{assignment.title}</h3><p className="mt-1 text-sm text-slate-500">{assignment.totalMarks} marks · {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No due date"}</p>{assignment.description && <p className="mt-2 text-sm text-slate-600">{assignment.description}</p>}</div><div className="flex gap-2"><a href={assignment.pdfUrl} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-1.5 text-sm">PDF</a><button onClick={() => viewSubmissions(assignment)} className="rounded-md border px-3 py-1.5 text-sm">Submissions</button><button onClick={() => openEditAssignment(assignment)} className="rounded-md border px-3 py-1.5 text-sm">Edit</button><button onClick={() => removeAssignment(assignment)} className="rounded-md border px-3 py-1.5 text-sm text-rose-600">Delete</button></div></div></article>)}
    </div>}
    {lessonModal && <LessonModal course={course} onClose={() => setLessonModal(false)} onSubmit={saveLesson} lessonForm={lessonForm} onChange={(e) => setLessonForm({ title: e.target.value })} lessonVideo={lessonVideo} setLessonVideo={setLessonVideo} loading={busy} editing={Boolean(editingLesson)} />}
    {assignmentModal && <AssignmentModal course={course} onClose={() => setAssignmentModal(false)} onSubmit={saveAssignment} assignmentForm={assignmentForm} onChange={(e) => setAssignmentForm((form) => ({ ...form, [e.target.name]: e.target.value }))} assignmentFile={assignmentFile} setAssignmentFile={setAssignmentFile} loading={busy} editing={Boolean(editingAssignment)} />}
    {submissionState.assignment && <Modal title={`Submissions · ${submissionState.assignment.title}`} onClose={() => setSubmissionState({ assignment: null, submissions: [], loading: false })}>{submissionState.loading ? <p>Loading submissions...</p> : submissionState.submissions.length ? <ul className="space-y-3">{submissionState.submissions.map((submission) => <li key={submission._id} className="rounded-lg bg-slate-50 p-3 text-sm"><p className="font-medium">{submission.student?.fullname || "Student"} · {submission.status}</p>{submission.answerUrl && <a className="text-indigo-700 underline" href={submission.answerUrl} target="_blank" rel="noreferrer">View submission</a>}<p>{submission.marks ?? "Not graded"} {submission.marks != null ? ` / ${submissionState.assignment.totalMarks}` : ""}</p></li>)}</ul> : <p>No submissions yet.</p>}</Modal>}
  </div>;
};

export default InstructorCourse;

import { useState } from "react";
import { toast } from "react-hot-toast";
import useInstructorStore from "../../store/instructorStore";

const emptyAssignmentForm = { title: "", description: "", totalMarks: "", dueDate: "" };
const emptyGradeForm = { marks: "", feedback: "" };

export const useAssignmentManager = () => {
  const {
    assignments,
    assignmentsLoading,
    submissions,
    submissionsLoading,
    getInstructorAssignments,
    createAssignment,
    getAssignmentSubmissions,
    gradeAssignment,
  } = useInstructorStore();

  // ---------- assignments list (per course) ----------
  const [assignmentsCourseId, setAssignmentsCourseId] = useState("");

  const loadAssignments = async (courseId) => {
    setAssignmentsCourseId(courseId);
    if (!courseId) return;

    const result = await getInstructorAssignments(courseId);
    if (!result.success) toast.error(result.message);
  };

  // ---------- create assignment ----------
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentCourse, setAssignmentCourse] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [assignmentFile, setAssignmentFile] = useState(null);

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAssignmentModal = (course) => {
    setAssignmentCourse(course);
    setAssignmentForm(emptyAssignmentForm);
    setAssignmentFile(null);
    setShowAssignmentModal(true);
  };

  const closeAssignmentModal = () => setShowAssignmentModal(false);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();

    if (!assignmentCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!assignmentFile) {
      toast.error("Please attach the assignment PDF");
      return;
    }

    const formData = new FormData();
    formData.append("title", assignmentForm.title);
    formData.append("description", assignmentForm.description);
    formData.append("totalMarks", assignmentForm.totalMarks);
    formData.append("dueDate", assignmentForm.dueDate);
    formData.append("assignment", assignmentFile);

    const result = await createAssignment(assignmentCourse._id, formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Assignment created successfully");
    setShowAssignmentModal(false);

    // keep the assignments list in sync if we're viewing this course
    if (assignmentsCourseId === assignmentCourse._id) {
      loadAssignments(assignmentCourse._id);
    }
  };

  // ---------- submissions + grading ----------
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [gradingId, setGradingId] = useState(null);
  const [gradeForm, setGradeForm] = useState(emptyGradeForm);

  const openSubmissions = async (assignment) => {
    setActiveAssignment(assignment);
    setShowSubmissionsModal(true);

    const result = await getAssignmentSubmissions(assignment._id);
    if (!result.success) toast.error(result.message);
  };

  const closeSubmissions = () => {
    setShowSubmissionsModal(false);
    setActiveAssignment(null);
    setGradingId(null);
    setGradeForm(emptyGradeForm);
  };

  const startGrading = (submission) => {
    setGradingId(submission._id);
    setGradeForm({
      marks: submission.marks ?? "",
      feedback: submission.feedback ?? "",
    });
  };

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    setGradeForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitGrade = async (submissionId) => {
    if (gradeForm.marks === "" || gradeForm.marks === null) {
      toast.error("Marks are required");
      return;
    }

    const result = await gradeAssignment(submissionId, {
      marks: gradeForm.marks,
      feedback: gradeForm.feedback,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Assignment graded successfully");
    setGradingId(null);
    setGradeForm(emptyGradeForm);
  };

  return {
    // list
    assignments,
    assignmentsLoading,
    assignmentsCourseId,
    loadAssignments,
    // create
    showAssignmentModal,
    assignmentCourse,
    assignmentForm,
    assignmentFile,
    setAssignmentFile,
    handleAssignmentChange,
    openAssignmentModal,
    closeAssignmentModal,
    handleCreateAssignment,
    // submissions / grading
    submissions,
    submissionsLoading,
    showSubmissionsModal,
    activeAssignment,
    gradingId,
    gradeForm,
    openSubmissions,
    closeSubmissions,
    startGrading,
    handleGradeChange,
    submitGrade,
  };
};

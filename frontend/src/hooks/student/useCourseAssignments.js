import { useState } from "react";
import toast from "react-hot-toast";
import useStudentStore from "../../store/studentStore";

export const useCourseAssignments = (courseId) => {
  const {
    assignments,
    assignmentsLoading,
    submissionLoading,
    resultLoading,
    assignmentResult,
    getMyCourseAssignments,
    submitAssignment,
    getMyAssignmentResult,
    clearAssignmentResult,
  } = useStudentStore();

  const [loaded, setLoaded] = useState(false);

  const loadAssignments = async () => {
    if (!courseId) return;
    const result = await getMyCourseAssignments(courseId);
    setLoaded(true);
    if (!result.success) toast.error(result.message);
  };

  // ---------- submit ----------
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);

  const openSubmitModal = (assignment) => {
    setActiveAssignment(assignment);
    setSubmissionFile(null);
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => setShowSubmitModal(false);

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    if (!activeAssignment) return;

    if (!submissionFile) {
      toast.error("Please attach your submission file");
      return;
    }

    const formData = new FormData();
    formData.append("file", submissionFile);

    const result = await submitAssignment(activeAssignment._id, formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Assignment submitted successfully");
    setShowSubmitModal(false);
  };

  // ---------- result ----------
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultAssignment, setResultAssignment] = useState(null);

  const openResult = async (assignment) => {
    setResultAssignment(assignment);
    setShowResultModal(true);
    const result = await getMyAssignmentResult(assignment._id);
    if (!result.success) toast.error(result.message);
  };

  const closeResult = () => {
    setShowResultModal(false);
    setResultAssignment(null);
    clearAssignmentResult();
  };

  return {
    assignments,
    assignmentsLoading,
    loaded,
    loadAssignments,
    // submit
    showSubmitModal,
    activeAssignment,
    submissionFile,
    setSubmissionFile,
    submissionLoading,
    openSubmitModal,
    closeSubmitModal,
    handleSubmitAssignment,
    // result
    showResultModal,
    resultAssignment,
    assignmentResult,
    resultLoading,
    openResult,
    closeResult,
  };
};

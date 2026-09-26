import { useState } from "react";
import { toast } from "react-hot-toast";
import useInstructorStore from "../../store/instructorStore";

export const useStudentsView = () => {
  const { students, getEnrolledStudents } = useInstructorStore();

  const [studentsCourseId, setStudentsCourseId] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);

  const loadStudents = async (courseId) => {
    setStudentsCourseId(courseId);
    if (!courseId) return;

    setStudentsLoading(true);
    const result = await getEnrolledStudents(courseId);
    setStudentsLoading(false);

    if (!result.success) toast.error(result.message);
  };

  const clearIfDeleted = (deletedCourseId) => {
    if (studentsCourseId === deletedCourseId) setStudentsCourseId("");
  };

  return { students, studentsCourseId, studentsLoading, loadStudents, clearIfDeleted };
};

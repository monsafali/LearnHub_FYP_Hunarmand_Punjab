import { useEffect } from "react";
import useStudentStore from "../../store/studentStore";

export const useMyCourses = () => {
  const enrolledCourses = useStudentStore((state) => state.enrolledCourses);
  const loading = useStudentStore((state) => state.loading);
  const getMyCourses = useStudentStore((state) => state.getMyCourses);

  useEffect(() => {
    getMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { enrolledCourses, loading };
};

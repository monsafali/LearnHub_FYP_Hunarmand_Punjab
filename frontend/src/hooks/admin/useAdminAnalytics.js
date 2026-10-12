import { useEffect } from "react";
import useAdminStore from "../../store/adminStore";

export const useAdminAnalytics = () => {
  const analytics = useAdminStore((state) => state.analytics);
  const loading = useAdminStore((state) => state.loading);
  const getAnalytics = useAdminStore((state) => state.getAnalytics);

  useEffect(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    getAnalytics("month", currentMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { analytics, loading, refreshAnalytics: getAnalytics };
};

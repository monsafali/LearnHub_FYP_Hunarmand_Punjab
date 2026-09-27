import { useEffect } from "react";
import useAdminStore from "../../store/adminStore";

export const useAdminAnalytics = () => {
  const analytics = useAdminStore((state) => state.analytics);
  const loading = useAdminStore((state) => state.loading);
  const getAnalytics = useAdminStore((state) => state.getAnalytics);

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { analytics, loading, refreshAnalytics: getAnalytics };
};

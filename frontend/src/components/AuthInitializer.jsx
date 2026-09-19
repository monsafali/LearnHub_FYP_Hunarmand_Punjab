import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const AuthInitializer = ({ children }) => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
};

export default AuthInitializer;

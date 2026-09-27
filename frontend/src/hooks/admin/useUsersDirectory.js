import { useEffect, useMemo, useState } from "react";
import useAdminStore from "../../store/adminStore";

export const useUsersDirectory = () => {
  const users = useAdminStore((state) => state.users);
  const loading = useAdminStore((state) => state.loading);
  const getUsers = useAdminStore((state) => state.getUsers);

  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = useMemo(() => {
    const value = search.toLowerCase();

    return users.filter(
      (item) =>
        item.fullname?.toLowerCase().includes(value) ||
        item.username?.toLowerCase().includes(value) ||
        item.email?.toLowerCase().includes(value) ||
        item.role?.toLowerCase().includes(value),
    );
  }, [users, search]);

  return { users, filteredUsers, loading, search, setSearch };
};

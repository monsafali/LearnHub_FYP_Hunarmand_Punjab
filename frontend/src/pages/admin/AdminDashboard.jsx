





import useAuthStore from "../../store/authStore";


import { useAdminAnalytics } from "../../hooks/admin/useAdminAnalytics";
import { useInstructors } from "../../hooks/admin/useInstructors";
import { useUsersDirectory } from "../../hooks/admin/useUsersDirectory";

import { AdminSidebar, AdminMobileHeader, AdminDesktopHeader } from "../../components/admin/AdminLayout";
import { DashboardOverview } from "../../components/admin/DashboardOverview";
import { InstructorsTable } from "../../components/admin/InstructorsTable";
import { UsersTable } from "../../components/admin/UsersTable";
import { CreateInstructorModal } from "../../components/admin/CreateInstructorModal";
import { EditInstructorModal } from "../../components/admin/EditInstructorModal";
import { useState } from "react";

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { analytics, refreshAnalytics } = useAdminAnalytics();
  const instructorManager = useInstructors();
  const { filteredUsers, search, setSearch } = useUsersDirectory();

  const goTo = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminMobileHeader onOpenSidebar={() => setSidebarOpen(true)} />

      <AdminSidebar
        activeTab={activeTab}
        goTo={goTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="lg:ml-64">
        <AdminDesktopHeader activeTab={activeTab} user={user} />

        <div className="p-4 md:p-8">
          {activeTab === "dashboard" && (
            <DashboardOverview
              analytics={analytics}
              onCreateInstructor={() => {
                setActiveTab("instructors");
                instructorManager.openCreateModal();
              }}
              onViewUsers={() => setActiveTab("users")}
            />
          )}

          {activeTab === "instructors" && (
            <InstructorsTable
              instructors={instructorManager.instructors}
              onCreate={instructorManager.openCreateModal}
              onEdit={instructorManager.openEditModal}
              onDelete={instructorManager.handleDeleteInstructor}
            />
          )}

          {activeTab === "users" && (
            <UsersTable filteredUsers={filteredUsers} search={search} setSearch={setSearch} />
          )}
        </div>
      </main>

      {instructorManager.showCreateModal && (
        <CreateInstructorModal
          onClose={instructorManager.closeCreateModal}
          onSubmit={(e) => instructorManager.handleCreateInstructor(e, refreshAnalytics)}
          form={instructorManager.createForm}
          updateField={instructorManager.updateCreateField}
          loading={instructorManager.loading}
        />
      )}

      {instructorManager.showEditModal && (
        <EditInstructorModal
          onClose={instructorManager.closeEditModal}
          onSubmit={instructorManager.handleUpdateInstructor}
          form={instructorManager.editForm}
          updateField={instructorManager.updateEditField}
          loading={instructorManager.loading}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

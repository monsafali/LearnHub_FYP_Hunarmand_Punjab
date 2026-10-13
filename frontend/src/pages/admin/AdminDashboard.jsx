





import useAuthStore from "../../store/authStore";


import { useAdminAnalytics } from "../../hooks/admin/useAdminAnalytics";
import { useInstructors } from "../../hooks/admin/useInstructors";
import { useUsersDirectory } from "../../hooks/admin/useUsersDirectory";

import { AdminSidebar } from "../../components/admin/AdminLayout";
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
      <AdminSidebar
        activeTab={activeTab}
        goTo={goTo}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="min-h-screen bg-slate-50 lg:pl-64">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-200">☰</button>
          <h1 className="truncate text-sm font-semibold text-slate-800">{activeTab === "instructors" ? "Manage instructors" : activeTab === "users" ? "Users" : "Dashboard"}</h1>
        </div>

        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <DashboardOverview
              analytics={analytics}
              onRefreshAnalytics={refreshAnalytics}
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

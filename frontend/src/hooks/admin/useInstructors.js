import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useAdminStore from "../../store/adminStore";

const emptyCreateForm = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const emptyEditForm = {
  fullname: "",
  username: "",
  email: "",
  cnic: "",
  district: "",
  districtId: "",
  tehsil: "",
  address: "",
  contactno: "",
  bio: "",
};

export const useInstructors = () => {
  const {
    instructors,
    loading,
    getInstructors,
    createInstructor,
    updateInstructor,
    deleteInstructor,
  } = useAdminStore();

  useEffect(() => {
    getInstructors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- create ----------
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const updateCreateField = (field) => (e) =>
    setCreateForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openCreateModal = () => {
    setCreateForm(emptyCreateForm);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateInstructor = async (e, onCreated) => {
    e.preventDefault();

    if (createForm.password !== createForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await createInstructor(createForm);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setShowCreateModal(false);
    setCreateForm(emptyCreateForm);
    onCreated?.();
  };

  // ---------- edit ----------
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const updateEditField = (field) => (e) =>
    setEditForm((prev) => ({ ...prev, [field]: e.target.value }));

  const openEditModal = (instructor) => {
    setSelectedInstructor(instructor);
    setEditForm({
      fullname: instructor.fullname || "",
      username: instructor.username || "",
      email: instructor.email || "",
      cnic: instructor.cnic || "",
      district: instructor.district || "",
      districtId: instructor.districtId || "",
      tehsil: instructor.tehsil || "",
      address: instructor.address || "",
      contactno: instructor.contactno || "",
      bio: instructor.bio || "",
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedInstructor(null);
  };

  const handleUpdateInstructor = async (e) => {
    e.preventDefault();

    const result = await updateInstructor(selectedInstructor._id, editForm);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    closeEditModal();
  };

  // ---------- delete ----------
  const handleDeleteInstructor = async (id) => {
    const result = await deleteInstructor(id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  return {
    instructors,
    loading,
    getInstructors,
    // create
    showCreateModal,
    createForm,
    updateCreateField,
    openCreateModal,
    closeCreateModal,
    handleCreateInstructor,
    // edit
    showEditModal,
    selectedInstructor,
    editForm,
    updateEditField,
    openEditModal,
    closeEditModal,
    handleUpdateInstructor,
    // delete
    handleDeleteInstructor,
  };
};

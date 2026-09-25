import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import useAuthStore from "../../store/authStore";
import useInstructorStore from "../../store/instructorStore";


const ICON_PATHS = {
  home: "M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25",
  book: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  users:
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  plus: "M12 4.5v15m7.5-7.5h-15",
  pencil:
    "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125",
  trash:
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
  video:
    "M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z",
  search:
    "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  menu: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  x: "M6 18L18 6M6 6l12 12",
  bell: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
  logout:
    "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75",
  refresh:
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  coin: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  grid: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  upload:
    "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
};

const Icon = ({ name, className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.6}
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
  </svg>
);

/* =====================================================
   HELPERS
===================================================== */
const BADGE_STYLES = [
  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "bg-amber-50 text-amber-700 ring-amber-200",
  "bg-rose-50 text-rose-700 ring-rose-200",
  "bg-sky-50 text-sky-700 ring-sky-200",
  "bg-violet-50 text-violet-700 ring-violet-200",
];

const BAR_STYLES = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

const hashIndex = (str = "", mod = 6) => {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) % 9973;
  }
  return hash % mod;
};

const formatPrice = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

/* =====================================================
   SMALL REUSABLE COMPONENTS
===================================================== */
const Modal = ({ title, subtitle, onClose, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-700">
      {label}
    </span>
    {children}
    {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
  </label>
);

const FilePicker = ({ accept, file, onChange, required, emptyText }) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 transition hover:border-indigo-400 hover:bg-indigo-50/40">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
      <Icon name="upload" className="h-4 w-4" />
    </span>
    <span className="min-w-0 flex-1 truncate text-sm text-slate-600">
      {file ? file.name : emptyText}
    </span>
    <input
      type="file"
      accept={accept}
      required={required}
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      className="sr-only"
    />
  </label>
);

const CourseThumb = ({ course, className = "" }) =>
  course.imageUrl ? (
    <img
      src={course.imageUrl}
      alt={course.name}
      className={`object-cover ${className}`}
    />
  ) : (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-semibold text-white ${className}`}
    >
      {course.name?.charAt(0)?.toUpperCase()}
    </div>
  );

const StatusBadge = ({ status }) => {
  const value = (status || "active").toLowerCase();
  const style =
    value === "completed"
      ? "bg-sky-50 text-sky-700 ring-sky-200"
      : value === "pending"
        ? "bg-amber-50 text-amber-700 ring-amber-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {status || "active"}
    </span>
  );
};


const InstructorDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    courses,
    students,
    loading,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    createLesson,
    getEnrolledStudents,
  } = useInstructorStore();

  // ---------- layout ----------
  const [activeView, setActiveView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---------- modals ----------
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  // ---------- course list filters ----------
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // ---------- students view ----------
  const [studentsCourseId, setStudentsCourseId] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);

  // ---------- course form ----------
  const [courseForm, setCourseForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });
  const [courseImage, setCourseImage] = useState(null);

  // ---------- lesson form ----------
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    duration: "",
    order: "",
  });
  const [lessonVideo, setLessonVideo] = useState(null);

  // =========================
  // FETCH COURSES
  // =========================
  useEffect(() => {
    getCourses();
  }, [getCourses]);

  // =========================
  // ONLY CURRENT INSTRUCTOR COURSES
  // =========================
  const instructorCourses = useMemo(() => {
    if (!user) return [];

    return courses.filter((course) => {
      const trainerId =
        typeof course.trainer === "object"
          ? course.trainer?._id
          : course.trainer;

      return trainerId === user._id;
    });
  }, [courses, user]);

  // =========================
  // DERIVED STATS
  // =========================
  const stats = useMemo(() => {
    const total = instructorCourses.length;
    const catalogValue = instructorCourses.reduce(
      (sum, c) => sum + Number(c.price || 0),
      0,
    );

    const byCategory = instructorCourses.reduce((acc, c) => {
      const key = c.category || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

    return {
      total,
      catalogValue,
      avgPrice: total ? Math.round(catalogValue / total) : 0,
      categories,
    };
  }, [instructorCourses]);

  const categoryOptions = useMemo(
    () => ["All", ...stats.categories.map(([name]) => name)],
    [stats.categories],
  );

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();

    return instructorCourses.filter((course) => {
      const matchesSearch =
        !q ||
        course.name?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q);

      const matchesCategory =
        categoryFilter === "All" || course.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [instructorCourses, search, categoryFilter]);

  // =========================
  // NAVIGATION
  // =========================
  const goTo = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const navItems = [
    {
      id: "courses",
      label: "My courses",
      icon: "book",
      badge: instructorCourses.length,
    },
    { id: "students", label: "Students", icon: "users" },
  ];

  const pageMeta = {
    overview: {

    },
    courses: {
      title: "My courses",
      subtitle: "Create, edit and add lessons to your courses",
    },
    students: {
      title: "Students",
      subtitle: "See who is enrolled in each course",
    },
  };

  // =========================
  // FORM INPUT HANDLERS
  // =========================
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLessonChange = (e) => {
    const { name, value } = e.target;
    setLessonForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetCourseForm = () => {
    setCourseForm({ name: "", category: "", description: "", price: "" });
    setCourseImage(null);
  };

  // =========================
  // CREATE COURSE
  // =========================
  const openCreateCourse = () => {
    resetCourseForm();
    setShowCreateCourse(true);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!courseImage) {
      toast.error("Please select a course image");
      return;
    }

    const data = new FormData();
    data.append("name", courseForm.name);
    data.append("category", courseForm.category);
    data.append("description", courseForm.description);
    data.append("price", courseForm.price);
    data.append("image", courseImage);

    const result = await createCourse(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course created successfully");

    resetCourseForm();
    setShowCreateCourse(false);
  };

  // =========================
  // EDIT COURSE
  // =========================
  const openEditCourse = (course) => {
    setSelectedCourse(course);

    setCourseForm({
      name: course.name || "",
      category: course.category || "",
      description: course.description || "",
      price: course.price ?? "",
    });

    setShowEditCourse(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!selectedCourse) return;

    const result = await updateCourse(selectedCourse._id, {
      name: courseForm.name,
      category: courseForm.category,
      description: courseForm.description,
      price: Number(courseForm.price),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Course updated successfully");

    setShowEditCourse(false);
    setSelectedCourse(null);
  };

  // =========================
  // DELETE COURSE
  // =========================
  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.name}"?`,
    );

    if (!confirmed) return;

    const result = await deleteCourse(course._id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    if (studentsCourseId === course._id) setStudentsCourseId("");

    toast.success(result.message || "Course deleted successfully");
  };

  // =========================
  // LESSON
  // =========================
  const openLessonModal = (course) => {
    setSelectedCourse(course);

    setLessonForm({ title: "", description: "", duration: "", order: "" });
    setLessonVideo(null);

    setShowLessonModal(true);
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    if (!lessonVideo) {
      toast.error("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("title", lessonForm.title);
    formData.append("description", lessonForm.description);
    formData.append("duration", lessonForm.duration);
    formData.append("order", lessonForm.order);
    formData.append("video", lessonVideo);

    const result = await createLesson(selectedCourse._id, formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message || "Lesson created successfully");

    setShowLessonModal(false);
    setLessonForm({ title: "", description: "", duration: "", order: "" });
    setLessonVideo(null);
  };

  // =========================
  // STUDENTS
  // =========================
  const loadStudents = async (courseId) => {
    setStudentsCourseId(courseId);

    if (!courseId) return;

    setStudentsLoading(true);
    const result = await getEnrolledStudents(courseId);
    setStudentsLoading(false);

    if (!result.success) toast.error(result.message);
  };

  const openStudents = (course) => {
    goTo("students");
    loadStudents(course._id);
  };

  const studentsCourse = instructorCourses.find(
    (c) => c._id === studentsCourseId,
  );

  // =========================
  // COURSE FORM FIELDS (shared by create + edit)
  // =========================
  const renderCourseFields = () => (
    <>
      <Field label="Course name">
        <input
          type="text"
          name="name"
          placeholder="e.g. Complete React Bootcamp"
          value={courseForm.name}
          onChange={handleCourseChange}
          required
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category">
          <input
            type="text"
            name="category"
            placeholder="e.g. Web development"
            value={courseForm.category}
            onChange={handleCourseChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Price (Rs.)">
          <input
            type="number"
            name="price"
            placeholder="0"
            value={courseForm.price}
            onChange={handleCourseChange}
            min="0"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          name="description"
          placeholder="What will students learn in this course?"
          value={courseForm.description}
          onChange={handleCourseChange}
          required
          rows={4}
          className={inputClass}
        />
      </Field>
    </>
  );

  /* =====================================================
     SIDEBAR
  ===================================================== */
  const sidebar = (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-slate-950 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* soft glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

      {/* brand */}
      <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-orange-500/20">
            <Icon name="book" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight text-white">
              Learnly
            </p>
            <p className="text-xs text-slate-500">Instructor studio</p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>
      </div>


      {/* nav */}
      <nav className="relative mt-4 flex-1 space-y-1 overflow-y-auto px-4">
        {navItems.map((item) => {
          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => goTo(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />
              )}

              <Icon
                name={item.icon}
                className={`h-5 w-5 ${
                  active
                    ? "text-amber-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              />

              <span className="flex-1 text-left">{item.label}</span>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-amber-400 text-slate-950"
                      : "bg-white/10 text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );


  const coursesView = (
    <div className="space-y-5">
      {/* toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your courses"
            className={`${inputClass} pl-10`}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputClass} md:w-52`}
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All categories" : cat}
            </option>
          ))}
        </select>

        <button
          onClick={() => getCourses()}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <Icon
            name="refresh"
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>

        <button
          onClick={openCreateCourse}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Icon name="plus" className="h-4 w-4" />
          New course
        </button>
      </div>

      {/* list */}
      {loading && instructorCourses.length === 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100"
            />
          ))}
        </div>
      ) : instructorCourses.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Icon name="book" className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            No courses yet
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            Create your first course, then add lessons so students can start
            learning.
          </p>
          <button
            onClick={openCreateCourse}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Create course
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-14 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-100">
          No courses match your search. Try a different keyword or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <article
              key={course._id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:shadow-md"
            >
              <div className="relative">
                <CourseThumb course={course} className="h-44 w-full" />

                <span
                  className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset backdrop-blur ${
                    BADGE_STYLES[
                      hashIndex(course.category, BADGE_STYLES.length)
                    ]
                  }`}
                >
                  {course.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug text-slate-900">
                    {course.name}
                  </h3>
                  <p className="shrink-0 text-base font-semibold text-indigo-600">
                    {formatPrice(course.price)}
                  </p>
                </div>

                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
                  {course.description}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openLessonModal(course)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                  >
                    <Icon name="video" className="h-4 w-4" />
                    Add lesson
                  </button>

                  <button
                    onClick={() => openStudents(course)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Icon name="users" className="h-4 w-4" />
                    Students
                  </button>

                  <button
                    onClick={() => openEditCourse(course)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Icon name="pencil" className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  /* =====================================================
     VIEW: STUDENTS
  ===================================================== */
  const studentsView = (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {studentsCourse
              ? studentsCourse.name
              : "Choose a course to see its students"}
          </p>
          <p className="text-sm text-slate-500">
            {studentsCourse && !studentsLoading
              ? `${students.length} ${
                  students.length === 1 ? "student" : "students"
                } enrolled`
              : "Enrollments are loaded per course"}
          </p>
        </div>

        <select
          value={studentsCourseId}
          onChange={(e) => loadStudents(e.target.value)}
          className={`${inputClass} md:w-72`}
        >
          <option value="">Select a course</option>
          {instructorCourses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {!studentsCourseId ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Icon name="users" className="h-7 w-7" />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Pick a course above to see who has enrolled.
            </p>
          </div>
        ) : studentsLoading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex animate-pulse items-center gap-4 p-5"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-40 rounded bg-slate-100" />
                  <div className="h-3 w-56 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500">
            No students are enrolled in this course yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {students.map((enrollment) => {
              const student = enrollment.student;

              return (
                <li
                  key={enrollment._id}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-slate-50/70"
                >
                  {student?.imageUrl ? (
                    <img
                      src={student.imageUrl}
                      alt={student.fullname}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 font-semibold text-white">
                      {student?.fullname?.charAt(0)?.toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {student?.fullname}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      @{student?.username}
                    </p>
                  </div>

                  <p className="hidden truncate text-sm text-slate-500 md:block md:w-56">
                    {student?.email}
                  </p>

                  <StatusBadge status={enrollment.status} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <>

 <div className="min-h-screen bg-slate-50">


      {sidebar}

      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        {/* top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200/70 bg-slate-50/80 px-4 py-4 backdrop-blur md:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 lg:hidden"
          >
            <Icon name="menu" className="h-6 w-6" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-slate-900">
              {pageMeta[activeView].title}
            </h1>
            <p className="hidden text-sm text-slate-500 sm:block">
              {pageMeta[activeView].subtitle}
            </p>
          </div>

          <button
            aria-label="Notifications"
            className="relative rounded-full bg-white p-2.5 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-900"
          >
            <Icon name="bell" className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullname}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white ring-2 ring-white">
                {user?.fullname?.charAt(0)?.toUpperCase() || "I"}
              </div>
            )}
          </div>
        </header>

        {/* page content */}
        <main className="mx-auto max-w-7xl p-4 md:p-8">
          {activeView === "overview" && coursesView}
          {activeView === "courses" && coursesView}
          {activeView === "students" && studentsView}
        </main>
      </div>

      {/* ================= CREATE COURSE MODAL ================= */}
      {showCreateCourse && (
        <Modal
          title="Create course"
          subtitle="Fill in the details students will see"
          onClose={() => setShowCreateCourse(false)}
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            {renderCourseFields()}

            <Field label="Course image">
              <FilePicker
                accept="image/png,image/jpeg,image/jpg"
                file={courseImage}
                onChange={setCourseImage}
                required
                emptyText="Choose a PNG or JPG image"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create course"}
            </button>
          </form>
        </Modal>
      )}

      {/* ================= EDIT COURSE MODAL ================= */}
      {showEditCourse && (
        <Modal
          title="Edit course"
          subtitle={selectedCourse?.name}
          onClose={() => setShowEditCourse(false)}
        >
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            {renderCourseFields()}

            <p className="rounded-lg bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
              The course image can't be changed from here yet.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </Modal>
      )}

      {/* ================= ADD LESSON MODAL ================= */}
      {showLessonModal && (
        <Modal
          title="Add lesson"
          subtitle={`Course: ${selectedCourse?.name}`}
          onClose={() => setShowLessonModal(false)}
        >
          <form onSubmit={handleCreateLesson} className="space-y-4">
            <Field label="Lesson title">
              <input
                type="text"
                name="title"
                placeholder="e.g. Introduction to hooks"
                value={lessonForm.title}
                onChange={handleLessonChange}
                required
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                name="description"
                placeholder="What is covered in this lesson?"
                value={lessonForm.description}
                onChange={handleLessonChange}
                rows={3}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Duration (minutes)">
                <input
                  type="number"
                  name="duration"
                  placeholder="0"
                  value={lessonForm.duration}
                  onChange={handleLessonChange}
                  min="0"
                  className={inputClass}
                />
              </Field>

              <Field label="Lesson order">
                <input
                  type="number"
                  name="order"
                  placeholder="1"
                  value={lessonForm.order}
                  onChange={handleLessonChange}
                  min="0"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Lesson video">
              <FilePicker
                accept="video/*"
                file={lessonVideo}
                onChange={setLessonVideo}
                emptyText="Choose a video file"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Add lesson"}
            </button>
          </form>
        </Modal>
      )}
    </div>
    </>

  );
};

export default InstructorDashboard;

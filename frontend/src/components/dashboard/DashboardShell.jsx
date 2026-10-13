import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Menu,
  MessageCircle,
  PlayCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";

const ICONS = {
  book: BookOpen,
  assignments: ClipboardList,
  courses: BookOpen,
  content: PlayCircle,
  chat: MessageCircle,
  dashboard: LayoutDashboard,
  instructors: UserPlus,
  students: GraduationCap,
  users: Users,
};

export const DashboardSidebar = ({
  title = "LearnHub",
  subtitle,
  items,
  activeItem,
  onSelect,
  open,
  onClose,
}) => (
  <>
    {open && (
      <button
        aria-label="Close navigation"
        className="fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
    )}
    <aside
      className={`fixed bottom-0 left-0 top-[76px] z-40 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-700 shadow-sm transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex min-h-20 items-center justify-between border-b border-slate-100 px-5">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-emerald-800">{title}</p>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <X size={19} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || LayoutDashboard;
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${active ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-emerald-800"} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              <Icon size={19} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  </>
);

export const DashboardHeader = ({ title, subtitle, user, onOpenSidebar }) => (
  <header className="sticky top-[76px] z-20 flex min-h-[76px] items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:gap-4 sm:px-6 lg:px-8">
    <button
      onClick={onOpenSidebar}
      aria-label="Open navigation"
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
    >
      <Menu size={21} />
    </button>
    <div className="min-w-0 flex-1">
      <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
        {title}
      </h1>
      <p className="hidden truncate text-sm text-slate-500 sm:block">
        {subtitle || `Welcome, ${user?.fullname || ""}`}
      </p>
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden text-right sm:block">
        <p className="max-w-40 truncate text-sm font-semibold text-slate-800">
          {user?.fullname}
        </p>
        <p className="text-xs text-slate-500">{user?.role}</p>
      </div>
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={user.fullname || "Profile"}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100 sm:h-10 sm:w-10"
        />
      ) : (
        <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white sm:h-10 sm:w-10">
          {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  </header>
);

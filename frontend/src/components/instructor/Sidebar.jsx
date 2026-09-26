import Icon from "../ui/Icon";

const NAV_ITEMS = [
  { id: "courses", label: "My courses", icon: "book" },
  { id: "assignments", label: "Assignments", icon: "clipboard" },
  { id: "students", label: "Students", icon: "users" },
];

export const Sidebar = ({
  activeView,
  goTo,
  sidebarOpen,
  setSidebarOpen,
  courseCount,
}) => {
  const navItems = NAV_ITEMS.map((item) =>
    item.id === "courses" ? { ...item, badge: courseCount } : item,
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-slate-950 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

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
                className={`h-5 w-5 ${active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"}`}
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
};

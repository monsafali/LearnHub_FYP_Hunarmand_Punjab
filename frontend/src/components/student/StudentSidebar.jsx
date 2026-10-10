import { BookOpen, ClipboardList, MessageCircle, PlayCircle, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "courses", label: "My courses", icon: <BookOpen size={20} /> },
  { id: "content", label: "Course content", icon: <PlayCircle size={20} /> },
  { id: "assignments", label: "Assignments", icon: <ClipboardList size={20} /> },
  { id: "chat", label: "Course chat", icon: <MessageCircle size={20} /> },
];

const StudentSidebar = ({ activeView, goTo, sidebarOpen, setSidebarOpen, courseCount }) => (
  <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-hidden bg-slate-950 text-slate-300 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
    <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-indigo-600/30 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-24 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
    <div className="relative flex items-center justify-between px-6 pb-4 pt-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-lg shadow-indigo-500/20"><BookOpen size={20} /></div>
        <div><p className="text-base font-semibold leading-tight text-white">Learnly</p><p className="text-xs text-slate-500">Student learning space</p></div>
      </div>
      <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"><X size={20} /></button>
    </div>
    <nav className="relative mt-4 flex-1 space-y-1 overflow-y-auto px-4">
      {NAV_ITEMS.map(({ id, label, icon }) => {
        const active = activeView === id;
        const disabled = id !== "courses" && courseCount === 0;
        return <button key={id} type="button" disabled={disabled} onClick={() => goTo(id)} className={`group relative flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"} disabled:cursor-not-allowed disabled:opacity-40`}>
          {active && <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-indigo-400" />}
          <span className={active ? "text-indigo-300" : "text-slate-500 group-hover:text-slate-300"}>{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          {id === "courses" && courseCount > 0 && <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-indigo-400 text-slate-950" : "bg-white/10 text-slate-300"}`}>{courseCount}</span>}
        </button>;
      })}
    </nav>
    <div className="relative m-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-medium text-white">Keep learning</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-400">Your courses, assignments, and classmates are all in one place.</p>
    </div>
  </aside>
);

export default StudentSidebar;

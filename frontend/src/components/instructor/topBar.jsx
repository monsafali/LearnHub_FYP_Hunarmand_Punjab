import Icon from "../ui/Icon";

export const TopBar = ({ title, subtitle, user, onOpenSidebar }) => (
  <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200/70 bg-slate-50/80 px-4 py-4 backdrop-blur md:px-8">
    <button
      onClick={onOpenSidebar}
      aria-label="Open menu"
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-200/60 lg:hidden"
    >
      <Icon name="menu" className="h-6 w-6" />
    </button>

    <div className="flex-1">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="hidden text-sm text-slate-500 sm:block">{subtitle}</p>
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
);

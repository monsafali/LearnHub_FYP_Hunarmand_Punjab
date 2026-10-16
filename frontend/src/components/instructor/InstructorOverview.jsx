import { BookOpen, CheckCircle2, ClipboardList, GraduationCap, PlayCircle, Send } from "lucide-react";

const ProgressRing = ({ value = 0, label, color }) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, Math.min(100, Number(value) || 0));
  return <div className="flex items-center gap-3">
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-label={`${label}: ${percentage}%`} role="img">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <circle cx="32" cy="32" r={radius} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - percentage / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold text-slate-800">{percentage}%</span>
    </div>
    <p className="max-w-24 text-xs font-medium leading-4 text-slate-500">{label}</p>
  </div>;
};

const Metric = ({ label, value, detail, icon, tone }) => {
  const IconComponent = icon;
  return (
  <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><IconComponent size={21} /></span>
    </div>
  </article>
  );
};

export const InstructorOverview = ({ analytics, loading, onRefresh, onOpenCourse }) => {
  const courses = analytics?.courseStats || [];
  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-emerald-700">Teaching overview</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Your course performance</h2><p className="mt-1 text-sm text-slate-500">Enrollment, learning progress, lectures, and assignment results.</p></div><button onClick={onRefresh} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Refresh stats</button></div>
    {loading && !analytics ? <div className="rounded-2xl bg-white p-12 text-center text-slate-500">Loading your teaching stats...</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="Courses" value={analytics?.courseCount || 0} detail={`${analytics?.lectureCount || 0} lectures published`} icon={BookOpen} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Enrolled students" value={analytics?.studentCount || 0} detail={`${analytics?.completedStudentCount || 0} completed a course`} icon={GraduationCap} tone="bg-blue-50 text-blue-700" />
        <Metric label="Average completion" value={`${analytics?.averageProgress || 0}%`} detail="Across active enrollments" icon={CheckCircle2} tone="bg-violet-50 text-violet-700" />
        <Metric label="Assignments" value={analytics?.assignmentCount || 0} detail="Published across your courses" icon={ClipboardList} tone="bg-amber-50 text-amber-700" />
        <Metric label="Submissions" value={analytics?.submissionCount || 0} detail={`${analytics?.gradedSubmissionCount || 0} graded`} icon={Send} tone="bg-cyan-50 text-cyan-700" />
        <Metric label="Awaiting grade" value={analytics?.pendingSubmissionCount || 0} detail="Student submissions to review" icon={PlayCircle} tone="bg-rose-50 text-rose-700" />
      </div>
      <section className="space-y-4">
        <div><h3 className="text-lg font-semibold text-slate-900">Your courses</h3><p className="mt-1 text-sm text-slate-500">Select a course to preview its lectures and manage course content.</p></div>
        {courses.map((course) => <button key={course._id} onClick={() => onOpenCourse(course)} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="min-w-0"><h4 className="truncate font-semibold text-slate-900">{course.name}</h4><p className="mt-1 text-sm text-slate-500">{course.students} students · {course.lectures} lectures · {course.assignments} assignments</p></div>
          <div className="flex shrink-0 gap-5"><ProgressRing value={course.averageProgress} label="Completion" color="#059669" /><ProgressRing value={course.averageScore} label="Results" color="#3b82f6" /></div>
        </button>)}
        {courses.length === 0 && <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Create a course to manage its lecture sequence.</div>}
      </section>
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        <div className="border-b border-slate-100 px-5 py-4"><h3 className="font-semibold text-slate-900">Course details</h3></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Course</th><th className="px-4 py-3">Students</th><th className="px-4 py-3">Lectures</th><th className="px-4 py-3">Completion</th><th className="px-4 py-3">Assignments</th><th className="px-4 py-3">Results</th></tr></thead><tbody className="divide-y divide-slate-100">{courses.map((course) => <tr key={course._id}><td className="px-5 py-4 font-medium text-slate-800">{course.name}</td><td className="px-4 py-4">{course.students}</td><td className="px-4 py-4">{course.lectures}</td><td className="px-4 py-4">{course.averageProgress}% <span className="text-xs text-slate-500">avg.</span></td><td className="px-4 py-4">{course.assignments}</td><td className="px-4 py-4">{course.averageScore}% <span className="text-xs text-slate-500">avg.</span></td></tr>)}</tbody></table></div>
      </section>
    </>}
  </div>;
};

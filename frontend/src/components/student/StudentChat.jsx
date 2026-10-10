import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Users, Wifi, WifiOff } from "lucide-react";
import useAuthStore from "../../store/authStore";
import useChatStore from "../../store/chatStore";

const initials = (name = "Student") => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const StudentChat = () => {
  const user = useAuthStore((state) => state.user);
  const courses = useChatStore((state) => state.courses);
  const selectedCourse = useChatStore((state) => state.selectedCourse);
  const messages = useChatStore((state) => state.messages);
  const members = useChatStore((state) => state.members);
  const loadingCourses = useChatStore((state) => state.loadingCourses);
  const loadingChat = useChatStore((state) => state.loadingChat);
  const sending = useChatStore((state) => state.sending);
  const connected = useChatStore((state) => state.connected);
  const error = useChatStore((state) => state.error);
  const fetchCourses = useChatStore((state) => state.fetchCourses);
  const selectCourse = useChatStore((state) => state.selectCourse);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const disconnect = useChatStore((state) => state.disconnect);
  const [draft, setDraft] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    fetchCourses();
    return () => disconnect();
  }, [fetchCourses, disconnect]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = async (event) => {
    event.preventDefault();
    if (!draft.trim() || sending) return;
    const result = await sendMessage(draft);
    if (result.success) setDraft("");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
            <MessageCircle size={17} /> Course community
          </div>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Chat with your classmates</h2>
          <p className="mt-1 text-sm text-slate-500">Each room is shared with students enrolled in that course.</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          {connected ? "Connected" : "Connecting"}
        </div>
      </div>

      <div className="grid min-h-[490px] lg:grid-cols-[250px_minmax(0,1fr)_220px]">
        <aside className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-r">
          <div className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Your course rooms</div>
          {loadingCourses && <p className="px-2 py-4 text-sm text-slate-500">Loading rooms...</p>}
          {!loadingCourses && courses.length === 0 && <p className="px-2 py-4 text-sm text-slate-500">Enroll in a course to join its chat.</p>}
          <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {courses.map((course) => {
              const active = selectedCourse?._id === course._id;
              return (
                <button key={course._id} type="button" onClick={() => selectCourse(course)} className={`flex min-w-52 flex-1 items-center gap-3 rounded-xl p-2.5 text-left transition lg:min-w-0 ${active ? "bg-indigo-50 text-indigo-900" : "hover:bg-slate-50"}`}>
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {course.imageUrl ? <img src={course.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center font-bold text-slate-500">{initials(course.name)}</div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{course.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500"><Users size={12} /> {course.studentCount} students</div>
                  </div>
                  {active && <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex min-h-[410px] flex-col">
          {selectedCourse ? <>
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div><h3 className="font-semibold text-slate-900">{selectedCourse.name}</h3><p className="text-xs text-slate-500">{selectedCourse.category || "Course chat"}</p></div>
              <div className="flex items-center gap-1 text-xs text-slate-500"><Users size={14} /> {members.length}</div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5">
              {loadingChat && <div className="py-12 text-center text-sm text-slate-500">Loading conversation...</div>}
              {!loadingChat && messages.length === 0 && <div className="grid h-full min-h-56 place-items-center text-center"><div><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-600"><MessageCircle size={22} /></div><p className="mt-3 font-semibold text-slate-800">Start the conversation</p><p className="mt-1 text-sm text-slate-500">Say hello to others taking this course.</p></div></div>}
              {messages.map((message) => {
                const ownMessage = String(message.sender?._id) === String(user?._id);
                return <div key={message._id} className={`flex items-end gap-2 ${ownMessage ? "justify-end" : "justify-start"}`}>
                  {!ownMessage && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">{initials(message.sender?.fullname)}</div>}
                  <div className={`max-w-[82%] ${ownMessage ? "items-end" : "items-start"} flex flex-col`}>
                    {!ownMessage && <span className="mb-1 ml-1 text-xs font-medium text-slate-500">{message.sender?.fullname || "Student"}</span>}
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${ownMessage ? "rounded-br-md bg-indigo-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-800"}`}>{message.content}</div>
                    <time className="mt-1 px-1 text-[10px] text-slate-400">{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                  </div>
                  {ownMessage && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-800 text-[10px] font-bold text-white">{initials(user?.fullname)}</div>}
                </div>;
              })}
              <div ref={messageEndRef} />
            </div>
            {error && <p role="alert" className="px-4 pt-2 text-sm text-red-600">{error}</p>}
            <form onSubmit={submit} className="flex items-center gap-2 border-t border-slate-100 p-3 sm:p-4">
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={2000} placeholder="Write a message..." aria-label="Message" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
              <button disabled={!draft.trim() || sending || !connected} type="submit" aria-label="Send message" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"><Send size={17} /></button>
            </form>
          </> : <div className="grid flex-1 place-items-center p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><MessageCircle size={26} /></div><h3 className="mt-4 font-semibold text-slate-900">Choose a course room</h3><p className="mt-1 max-w-xs text-sm text-slate-500">Pick a course to see messages and meet your classmates.</p></div></div>}
        </div>

        <aside className="hidden border-l border-slate-200 p-4 lg:block">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700"><Users size={16} /> Classmates <span className="text-xs font-normal text-slate-400">{members.length}</span></div>
          {!selectedCourse && <p className="text-sm text-slate-400">Choose a course to see its students.</p>}
          <div className="space-y-3">
            {members.slice(0, 30).map((member) => <div key={member._id} className="flex min-w-0 items-center gap-2.5">
              {member.imageUrl ? <img src={member.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">{initials(member.fullname)}</div>}
              <span className="truncate text-sm text-slate-700">{member.fullname}{String(member._id) === String(user?._id) ? " (you)" : ""}</span>
            </div>)}
            {members.length > 30 && <p className="text-xs text-slate-400">and {members.length - 30} more</p>}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default StudentChat;

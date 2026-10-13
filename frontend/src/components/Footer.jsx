const Footer = () => {
  return (
    <footer className="relative z-50 border-t border-slate-200 bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-10">
        <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <h2 className="mb-3 text-xl font-bold text-white">LearnHub</h2>

            <p className="max-w-md text-sm leading-6 text-slate-300">
              Learn new skills, improve your knowledge, and build your career
              with our online learning platform.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Quick Links</h3>

            <div className="space-y-2 text-sm text-slate-300">
              <p className="cursor-pointer hover:text-black-900">Courses</p>

              <p className="cursor-pointer">About</p>

              <p className="cursor-pointer">Contact</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-white">Account</h3>

            <div className="space-y-2 text-sm text-slate-300">
              <p className="cursor-pointer">My Profile</p>

              <p className="cursor-pointer ">Change Password</p>

              <p className="cursor-pointer">Support</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

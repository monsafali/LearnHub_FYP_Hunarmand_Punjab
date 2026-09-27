const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="mb-3 text-xl font-bold">LMS</h2>

            <p className="text-sm leading-6 text-black">
              Learn new skills, improve your knowledge, and build your career
              with our online learning platform.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Quick Links</h3>

            <div className="space-y-2 text-sm text-black">
              <p className="cursor-pointer hover:text-black-900">Courses</p>

              <p className="cursor-pointer text-black">About</p>

              <p className="cursor-pointer text-black">Contact</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold">Account</h3>

            <div className="space-y-2 text-sm text-black">
              <p className="cursor-pointer text-black">My Profile</p>

              <p className="cursor-pointer ">Change Password</p>

              <p className="cursor-pointer text-black">Support</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} LMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

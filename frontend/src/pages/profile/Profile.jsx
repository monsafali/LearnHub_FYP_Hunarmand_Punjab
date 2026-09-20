import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );
  const loading = useAuthStore((state) => state.loading);

  const [formData, setFormData] = useState({
    cnic: "",
    district: "",
    districtId: "",
    tehsil: "",
    address: "",
    contactno: "",
    bio: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load current user data
  useEffect(() => {
    if (!user) return;

    setFormData({
      cnic: user.cnic || "",
      district: user.district || "",
      districtId: user.districtId || "",
      tehsil: user.tehsil || "",
      address: user.address || "",
      contactno: user.contactno || "",
      bio: user.bio || "",
    });

    // Your backend uses `image`
    setPreview(user.imageUrl || "");
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    // Show new image immediately
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Your backend requires imageFile
    if (!imageFile) {
      setError("Please select a profile image.");
      return;
    }

    const data = new FormData();

    data.append("cnic", formData.cnic);
    data.append("district", formData.district);
    data.append("districtId", formData.districtId);
    data.append("tehsil", formData.tehsil);
    data.append("address", formData.address);
    data.append("contactno", formData.contactno);
    data.append("bio", formData.bio);

    // IMPORTANT: backend expects imageFile
    data.append("imageFile", imageFile);

    const result = await updateProfile(data);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);

    // New image is now stored in backend
    if (result.user?.imageUrl) {
      setPreview(result.user.imageUrl);
    }

    setImageFile(null);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            View and update your profile information.
          </p>
        </div>

        {/* Account Information */}

        <div className="mb-8 rounded-xl bg-gray-50 p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Account Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-medium">
                {user.fullname}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Username
              </p>

              <p className="font-medium">
                {user.username}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-medium">
                {user.role}
              </p>
            </div>

          </div>
        </div>

        {/* Profile Image */}

        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">
            Profile Image
          </h2>

          {preview && (
            <img
              src={preview}
              alt="Profile"
              className="mb-4 h-28 w-28 rounded-full object-cover"
            />
          )}

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            JPG, JPEG or PNG only
          </p>
        </div>

        {/* Messages */}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-100 p-3 text-green-600">
            {success}
          </div>
        )}

        {/* Profile Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* CNIC */}

            <div>
              <label className="mb-2 block font-medium">
                CNIC
              </label>

              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* District */}

            <div>
              <label className="mb-2 block font-medium">
                District
              </label>

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* District ID */}

            <div>
              <label className="mb-2 block font-medium">
                District ID
              </label>

              <input
                type="text"
                name="districtId"
                value={formData.districtId}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tehsil */}

            <div>
              <label className="mb-2 block font-medium">
                Tehsil
              </label>

              <input
                type="text"
                name="tehsil"
                value={formData.tehsil}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact */}

            <div>
              <label className="mb-2 block font-medium">
                Contact Number
              </label>

              <input
                type="text"
                name="contactno"
                value={formData.contactno}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Address */}

          <div>
            <label className="mb-2 block font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}

          <div>
            <label className="mb-2 block font-medium">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Updating Profile..."
              : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;

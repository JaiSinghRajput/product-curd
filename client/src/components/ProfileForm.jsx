import { useEffect, useMemo, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import FormInput from "./FormInput";
import { useAuth } from "../hooks/useAuth";

const ProfileForm = () => {
  const { user, updateProfile, isProfileUpdating, error, clearError } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(user?.profileImage || "");

  useEffect(() => {
    setName(user?.name || "");
    setPreviewUrl(user?.profileImage || "");
    setProfileImageFile(null);
    setRemoveProfileImage(false);
    setSuccessMessage("");
  }, [user]);

  useEffect(() => {
    if (!profileImageFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(profileImageFile);
    setPreviewUrl(objectUrl);
    setRemoveProfileImage(false);

    return () => URL.revokeObjectURL(objectUrl);
  }, [profileImageFile]);

  const displayInitial = useMemo(() => {
    return (name || user?.email || user?.phone || "P").slice(0, 1).toUpperCase();
  }, [name, user]);

  const hasChanges =
    name.trim() !== (user?.name || "") || profileImageFile || removeProfileImage;

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearError();
    setSuccessMessage("");

    const result = await updateProfile({
      name: name.trim(),
      profileImageFile,
      removeProfileImage,
    });

    if (result.success) {
      setSuccessMessage("Profile updated successfully");
      setProfileImageFile(null);
      setRemoveProfileImage(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearError();
    setSuccessMessage("");
    setProfileImageFile(file);
  };

  const handleRemoveImage = () => {
    clearError();
    setSuccessMessage("");
    setProfileImageFile(null);
    setPreviewUrl("");
    setRemoveProfileImage(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow p-6 md:p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Account</p>
          <h2 className="text-2xl font-semibold text-slate-900 mt-2">Profile details</h2>
          <p className="text-sm text-slate-500 mt-1">Keep your display name and avatar current across the dashboard.</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <FormInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => {
            clearError();
            setSuccessMessage("");
            setName(event.target.value);
          }}
        />

        <div className="mb-5">
          <label className="text-sm text-gray-700 block mb-2">Profile image</label>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-200 flex items-center justify-center text-xl font-semibold text-slate-700">
                {previewUrl ? (
                  <img src={previewUrl} alt={name || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  displayInitial
                )}
              </div>

              <div className="flex-1 min-w-52">
                <p className="text-sm font-medium text-slate-800">Upload a new image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP or GIF. Max 5 MB.</p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-slate-800 transition">
                    <Camera size={16} />
                    Choose file
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </label>

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Trash2 size={16} />
                    Remove photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProfileUpdating || !hasChanges}
          className="w-full rounded-xl bg-blue-900 px-4 py-3 text-white font-medium hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isProfileUpdating ? "Saving..." : "Save profile"}
        </button>
      </form>

      <aside className="rounded-3xl bg-linear-to-br from-slate-900 to-slate-700 text-white p-6 md:p-8 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">Preview</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center text-xl font-semibold">
            {previewUrl ? (
              <img src={previewUrl} alt={name || "Profile"} className="w-full h-full object-cover" />
            ) : (
              displayInitial
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{name || "Your name"}</h3>
            <p className="text-sm text-slate-300">{user?.email || user?.phone || "No contact saved"}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3 text-sm text-slate-200">
          <p>Your avatar appears in the header after saving.</p>
          <p>Profile images are uploaded to the existing Cloudinary flow used by the app.</p>
          <p>Name updates are stored on the user record and shown only on this profile page and header avatar state.</p>
        </div>
      </aside>
    </div>
  );
};

export default ProfileForm;
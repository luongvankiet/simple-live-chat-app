import { useAuth } from '@/hooks/useAuth';
import { Camera, Mail, User } from 'lucide-react';
import { useState } from 'react';

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profileImage: base64Image });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="mx-auto max-w-2xl p-4 py-8">
        <div className="bg-base-300 space-y-8 rounded-xl p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser?.profileImage || '/images/profile-picture.webp'}
                alt="profile-picture"
                className="size-32 rounded-full border-4 object-cover p-1"
              />

              <label
                htmlFor="avatar-upload"
                className={`bg-base-content absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-105 ${isUpdatingProfile && 'animate-pulse'}`}
              >
                <Camera className="text-base-200 h-5 w-5" />
                <input type="file" id="avatar-upload" className="hidden" onChange={handleImageUpdate} disabled={isUpdatingProfile} />
              </label>
            </div>

            <p className="text-sm text-zinc-400">{isUpdatingProfile ? 'Updating...' : 'Upload a new profile picture'}</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="h-4 w-4" />
                Full Name
              </div>
              <p className="bg-base-200 rounded-lg border px-4 py-2.5">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="bg-base-200 rounded-lg border px-4 py-2.5">{authUser?.email}</p>
            </div>
          </div>

          <div className="bg-base-300 mt-6 rounded-xl p-6">
            <h2 className="mb-4 text-lg font-medium">Account Information</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-zinc-700 py-2">
                <span className="text-zinc-400">Member Since</span>
                <p className="font-semibold">{authUser?.createdAt?.split('T')[0]}</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-400">Account Status</span>
                <p className="font-semibold">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

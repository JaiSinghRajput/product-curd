import DashboardLayout from "../layouts/DashboardLayout";
import ProfileForm from "../components/ProfileForm";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {user ? <ProfileForm /> : <ProfileSkeleton />}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileForm from "../components/ProfileForm";

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
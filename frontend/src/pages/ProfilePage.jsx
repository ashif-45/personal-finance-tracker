import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Lock, Calendar, Mail } from 'lucide-react';
import { userApi } from '../api/userApi.js';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import ChangePassword from '../components/profile/ChangePassword.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { formatDate } from '../utils/formatDate.js';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const loadProfile = async () => {
    try {
      const res = await userApi.getProfile();
      setProfile(res.data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (values) => {
    try {
      const res = await userApi.updateProfile(values);
      setProfile(res.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await userApi.changePassword(values);
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account information and security</p>
      </div>

      {/* Profile Header Card */}
      {profile && (
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <User size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile.fullName}</h2>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Joined {formatDate(profile.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'profile'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <User size={16} /> Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'password'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock size={16} /> Password
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <Card title="Personal Information" subtitle="Update your name, email, and preferences">
          <ProfileForm profile={profile} onSubmit={handleUpdateProfile} />
        </Card>
      )}

      {activeTab === 'password' && (
        <Card title="Change Password" subtitle="Ensure your account stays secure">
          <ChangePassword onSubmit={handleChangePassword} />
        </Card>
      )}
    </div>
  );
}
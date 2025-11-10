import React from 'react';
import { useAuth } from '@/features/auth/auth-context';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    navigate('/', { replace: true });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Your profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Manage your preferences to steer the recommendation engine toward what you love.
        </p>
      </div>
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-500">Name</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Favourite categories</p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {(user.prefs?.categories || ['All']).join(', ')}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;

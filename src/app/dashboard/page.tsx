'use client';

import { APP_URL } from '@/constants/routes';
import { logout } from '@/services/api';
import { useUserStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';

function DashboardContent() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clear = useUserStore((state) => state.clear);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      console.error('Logout API failed');
    }

    clear();
    toast.success('Logged out successfully');
    router.push(APP_URL.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Welcome back!
          </h2>

          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Username:</span> {user?.username}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">User ID:</span> {user?._id}
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-300">
              This is a basic dashboard placeholder. Add your features here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

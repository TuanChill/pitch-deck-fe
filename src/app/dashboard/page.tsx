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

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push(APP_URL.PITCH_DECKS)}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Pitch Decks</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and manage your pitch decks
              </p>
            </button>

            <button
              onClick={() => router.push(APP_URL.PITCH_DECK_UPLOAD)}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Upload Deck</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upload a new pitch deck</p>
            </button>
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

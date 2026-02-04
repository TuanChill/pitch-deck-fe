'use client';

import { APP_URL } from '@/constants/routes';
import { login } from '@/services/api';
import { useUserStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const USERNAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  return (
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Login failed'
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useUserStore((state) => state.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      toast.error('Username is required');

      return;
    }

    if (trimmedUsername.length < USERNAME_MIN_LENGTH) {
      toast.error(`Username must be at least ${USERNAME_MIN_LENGTH} characters`);

      return;
    }

    if (!password) {
      toast.error('Password is required');

      return;
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      toast.error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);

      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ username: trimmedUsername, password });

      setAuth(response.user, response.accessToken);

      toast.success('Login successful');

      router.push(APP_URL.PITCH_DECK);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                minLength={USERNAME_MIN_LENGTH}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                minLength={PASSWORD_MIN_LENGTH}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { APP_URL } from '@/constants/routes';
import { useUserStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const jwt = useUserStore((state) => state.jwt);

  useEffect(() => {
    if (!jwt) {
      router.push(APP_URL.LOGIN);
    }
  }, [jwt, router]);

  if (!jwt) {
    return null;
  }

  return <>{children}</>;
}

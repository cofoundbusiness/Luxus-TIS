import type { ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '../auth/auth-context';

export function Providers({ children }: { children?: ReactNode }) {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {children}
    </AuthProvider>
  );
}

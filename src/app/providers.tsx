import type { ReactNode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export function Providers({ children }: { children?: ReactNode }) {
  return (
    <>
      <RouterProvider router={router} />
      {children}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "../components/Sidebar";
import apiClient from '../lib/api';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await apiClient.get<{ user?: { company?: unknown } }>('/company/me');
        const hasCompany = !!res.data?.user?.company;

        if (!hasCompany) {
          // User needs to onboard
          if (pathname !== '/onboarding') {
            router.replace('/onboarding');
          } else {
            setAuthorized(true);
          }
        } else {
          // User already has a company
          if (pathname === '/onboarding') {
            router.replace('/');
          } else {
            setAuthorized(true);
          }
        }
      } catch {
        // Token invalid or expired — clear and redirect
        document.cookie = 'token=; path=/; max-age=0';
        router.replace('/login');
      } finally {
        setChecked(true);
      }
    };
    checkOnboarding();
  }, [pathname, router]);

  if (!checked || !authorized) {
    return (
      <div className="w-full flex h-screen items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-[#09090b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </>
  );
}

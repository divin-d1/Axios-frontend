'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { 
    name: 'Dashboard', href: '/',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  { 
    name: 'Jobs', href: '/jobs',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  },
  { 
    name: 'Candidates', href: '/candidates',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  { 
    name: 'Communications', href: '/emails',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
  },
  { 
    name: 'Company', href: '/company',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  // Hide on auth/onboarding pages
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/register') || 
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password')
  ) {
    return null;
  }

  return (
    <>
    <aside className={`sidebar ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'} h-screen flex-shrink-0 flex-col hidden md:flex`}>
      {/* Logo */}
      <div className={`flex items-center ${expanded ? 'px-6' : 'px-0 justify-center'} h-16 border-b border-white/10`}>
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center p-1.5 flex-shrink-0">
          <Image src="/logo.png" alt="Axios" width={32} height={32} className="w-full h-full object-contain" />
        </div>
        {expanded && <span className="ml-3 text-lg font-bold tracking-wider text-white">AXIOS</span>}
      </div>

      {/* Toggle */}
      <div className={`flex items-center ${expanded ? 'justify-end pr-4' : 'justify-center'} py-4`}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {expanded 
              ? <><polyline points="15 18 9 12 15 6"/></>
              : <><polyline points="9 18 15 12 9 6"/></>
            }
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`flex items-center gap-3 ${expanded ? 'px-4' : 'justify-center px-0'} py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {expanded && <span className="text-sm text-white">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`p-4 border-t border-white/10 ${expanded ? '' : 'flex justify-center'}`}>
        <button
          onClick={() => { document.cookie = 'token=; path=/; max-age=0'; window.location.href = '/login'; }}
          className={`flex items-center gap-3 w-full text-white/50 hover:text-white transition-colors hover:bg-white/5 p-2 rounded-lg ${expanded ? '' : 'justify-center'}`}
          title="Logout"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {expanded && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>

    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#09090b] border-t border-white/10 px-2 py-2">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 ${
                isActive ? 'text-white bg-white/10' : 'text-white/60'
              }`}
            >
              <span className="scale-90">{item.icon}</span>
              <span className="text-[10px] leading-none">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
    </>
  );
}

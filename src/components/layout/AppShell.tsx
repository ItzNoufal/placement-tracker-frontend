'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';
import AddApplicationModal from '@/components/ui/AddApplicationModal';
import RescheduleModal from '@/components/ui/RescheduleModal';
import { Application } from '@/types';
import { hasSession } from '@/lib/api';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isAuthRoute = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = hasSession();
      setIsAuthenticated(authenticated);

      if (!authenticated && !isAuthRoute) {
        router.replace('/login');
      } else if (authenticated && isAuthRoute) {
        router.replace('/');
      }
    };

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [pathname, isAuthRoute, router]);

  const handleAddApplication = (newApp: Application) => {
    const event = new CustomEvent('new-application-added', { detail: newApp });
    window.dispatchEvent(event);
  };

  // If on login or register, render isolated auth layout with no sidebar or header
  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#070b14] text-[#f1f5f9] antialiased selection:bg-[#3b82f6] selection:text-white flex items-center justify-center">
        <main className="w-full">
          {children}
        </main>
      </div>
    );
  }

  // Guard against unauthenticated access on protected pages
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#3b82f6]/30 border-t-[#3b82f6] animate-spin" />
        <p className="text-xs font-mono-code tracking-wider uppercase text-slate-400">
          Securing session &amp; authenticating...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f1f5f9] antialiased selection:bg-[#3b82f6] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Column */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        {/* Global Header */}
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="w-full pt-[72px] px-4 sm:px-6 lg:px-7 pb-24 lg:pb-12 flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onQuickAdd={() => setIsAddModalOpen(true)} />

      {/* Global Modals */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddApplication}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
      />
    </div>
  );
}

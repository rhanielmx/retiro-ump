'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatPhoneNumber } from '@/lib/phone-utils';
import { useAuth } from '@/contexts/AuthContext';
import { TabNavigation } from '@/components/admin/TabNavigation';
import { ParticipantsTab } from '@/components/admin/ParticipantsTab';
import { ExpensesTab } from '@/components/admin/ExpensesTab';
import { ShopsTab } from '@/components/admin/ShopsTab';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('participants');
  const router = useRouter();
  
  const { isAuthenticated, login, logout, checkAuth } = useAuth();

  // Add a state to track if we're checking authentication on initial load
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (hasInitialized) return; // Prevent multiple initializations
      
      setCheckingAuth(true);
      const isValid = await checkAuth();
      if (!isValid) {
        router.push('/admin');
      }
      setCheckingAuth(false);
      setHasInitialized(true);
    };

    initializeAuth();
  }, [checkAuth, hasInitialized, router]);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated && !checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Área Administrativa</h1>
          <div className="text-center text-gray-600">
            Redirecionando para login...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="mb-6">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'participants' && <ParticipantsTab />}
          {activeTab === 'expenses' && <ExpensesTab />}
          {activeTab === 'shops' && <ShopsTab />}
        </div>
      </main>
    </div>
  );
}

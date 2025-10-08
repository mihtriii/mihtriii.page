import React, { useState } from 'react';
import { Upload, BarChart3, Settings, FileText, Users, TrendingUp, Menu, X } from 'lucide-react';

import AdminDashboard from '../components/admin/AdminDashboard';
import FileUploader from '../components/admin/FileUploader';
import PresentationManager from '../components/admin/PresentationManager';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      component: AdminDashboard,
    },
    {
      id: 'upload',
      name: 'Upload Files',
      icon: Upload,
      component: FileUploader,
    },
    {
      id: 'manage',
      name: 'Manage Content',
      icon: FileText,
      component: PresentationManager,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: TrendingUp,
      component: () => <div className="p-6">Analytics coming soon...</div>,
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      component: () => <div className="p-6">Settings coming soon...</div>,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || AdminDashboard;

  const handleUploadComplete = (data) => {
    // Show success message and optionally switch to manage tab
    alert(`Successfully uploaded: ${data.presentation.title}`);
    setActiveTab('manage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors
                    ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            {tabs.find((tab) => tab.id === activeTab)?.name}
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <ActiveComponent
            onUploadComplete={activeTab === 'upload' ? handleUploadComplete : undefined}
          />
        </main>
      </div>
    </div>
  );
};

export default Admin;

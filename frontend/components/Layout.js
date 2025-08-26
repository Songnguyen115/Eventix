import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Dashboard', href: '/' },
  {
    name: 'Identity Service',
    children: [
      { name: 'Authentication', href: '/identity/auth' },
      { name: 'Role Management', href: '/identity/roles' },
      { name: 'Profile Management', href: '/identity/profiles' },
    ],
  },
  {
    name: 'Notifications',
    children: [
      { name: 'Email Notifications', href: '/notifications/email' },
      { name: 'SMS Notifications', href: '/notifications/sms' },
      { name: 'Push Notifications', href: '/notifications/push' },
    ],
  },
  {
    name: 'Events',
    children: [
      { name: 'Event Management', href: '/events/management' },
      { name: 'Event Categories', href: '/events/categories' },
      { name: 'Resource Management', href: '/events/resources' },
    ],
  },
  {
    name: 'Content',
    children: [
      { name: 'Content Management', href: '/content/management' },
      { name: 'Media Management', href: '/content/media' },
      { name: 'SEO Management', href: '/content/seo' },
    ],
  },
  {
    name: 'Tickets',
    children: [
      { name: 'Ticket Management', href: '/tickets/management' },
      { name: 'QR Code Generation', href: '/tickets/qr-codes' },
      { name: 'Capacity Management', href: '/tickets/capacity' },
    ],
  },
  {
    name: 'Payments',
    children: [
      { name: 'Payment Processing', href: '/payments/processing' },
      { name: 'Invoice Generation', href: '/payments/invoices' },
      { name: 'Refund Handling', href: '/payments/refunds' },
    ],
  },
  { name: 'Attendance Tracking', href: '/checkin/attendance' },
  {
    name: 'Analytics',
    children: [
      { name: 'Reports', href: '/analytics/reports' },
      { name: 'Dashboard Metrics', href: '/analytics/dashboard' },
      { name: 'Survey Management', href: '/analytics/surveys' },
    ],
  },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const router = useRouter();

  const toggleExpanded = (name) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isCurrentPath = (href) => {
    return router.pathname === href;
  };

  const isParentActive = (children) => {
    return children?.some(child => isCurrentPath(child.href));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
              <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-indigo-600">Eventix</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {!item.children ? (
                      <Link
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isCurrentPath(item.href)
                            ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                            : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={`group flex w-full items-center px-2 py-2 text-left text-sm font-medium rounded-md ${
                            isParentActive(item.children)
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.name}
                          <span className="ml-auto">
                            {expandedItems[item.name] ? '−' : '+'}
                          </span>
                        </button>
                        {expandedItems[item.name] && (
                          <div className="mt-1 space-y-1">
                            {item.children.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`group flex items-center px-4 py-2 text-sm rounded-md ${
                                  isCurrentPath(subItem.href)
                                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Settings */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <Link
                href="/settings"
                className="group flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:text-indigo-700 hover:bg-gray-50"
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="ml-2 text-xl font-bold text-indigo-600">Eventix</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <div className="flex h-16 items-center px-6 border-b border-gray-200">
              <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-indigo-600">Eventix</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 overflow-y-auto">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {!item.children ? (
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isCurrentPath(item.href)
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={`group flex w-full items-center px-2 py-2 text-left text-sm font-medium rounded-md ${
                            isParentActive(item.children)
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.name}
                          <span className="ml-auto">
                            {expandedItems[item.name] ? '−' : '+'}
                          </span>
                        </button>
                        {expandedItems[item.name] && (
                          <div className="mt-1 space-y-1">
                            {item.children.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center px-4 py-2 text-sm rounded-md ${
                                  isCurrentPath(subItem.href)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-700 hover:bg-gray-50'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar for mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-2 text-xl font-bold text-indigo-600">Eventix</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
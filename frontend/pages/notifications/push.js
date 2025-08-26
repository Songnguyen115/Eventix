import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  BellIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

const pushTemplates = [
  {
    id: 1,
    name: 'Event Reminder',
    title: 'Event Starting Soon!',
    message: '{{event_name}} starts in 30 minutes. Don\'t miss out!',
    category: 'Event Notifications',
    status: 'active',
    lastUsed: '2024-03-15T10:30:00Z',
    delivered: 12847,
    opened: 3241,
    clicked: 892,
    icon: 'calendar',
    actionUrl: '/events/{{event_id}}'
  },
  {
    id: 2,
    name: 'New Event Available',
    title: 'New Event: {{event_name}}',
    message: 'A new event has been added that might interest you!',
    category: 'Promotional',
    status: 'active',
    lastUsed: '2024-03-14T15:45:00Z',
    delivered: 8934,
    opened: 2341,
    clicked: 567,
    icon: 'star',
    actionUrl: '/events/{{event_id}}'
  },
  {
    id: 3,
    name: 'Welcome Push',
    title: 'Welcome to Eventix!',
    message: 'Thanks for downloading our app. Discover amazing events near you!',
    category: 'User Onboarding',
    status: 'active',
    lastUsed: '2024-03-13T09:20:00Z',
    delivered: 2341,
    opened: 1456,
    clicked: 234,
    icon: 'heart',
    actionUrl: '/events'
  },
  {
    id: 4,
    name: 'Ticket Reminder',
    title: 'Don\'t Forget Your Ticket!',
    message: 'Show this notification at the entrance for {{event_name}}',
    category: 'Transactional',
    status: 'active',
    lastUsed: '2024-03-12T14:15:00Z',
    delivered: 1567,
    opened: 1234,
    clicked: 1098,
    icon: 'ticket',
    actionUrl: '/tickets/{{ticket_id}}'
  }
];

const pushCampaigns = [
  {
    id: 1,
    name: 'Weekend Events Promotion',
    title: 'Amazing Weekend Events!',
    message: 'Don\'t miss these exciting events happening this weekend!',
    platforms: ['ios', 'android', 'web'],
    recipients: 15234,
    scheduled: '2024-03-16T09:00:00Z',
    status: 'scheduled',
    delivered: 0,
    opened: 0,
    clicked: 0
  },
  {
    id: 2,
    name: 'Flash Sale Notification',
    title: '⚡ Flash Sale: 50% Off!',
    message: 'Limited time offer on premium event tickets. Hurry up!',
    platforms: ['ios', 'android'],
    recipients: 8934,
    scheduled: null,
    status: 'sent',
    delivered: 8756,
    opened: 3241,
    clicked: 892,
    sentAt: '2024-03-14T12:00:00Z'
  },
  {
    id: 3,
    name: 'App Update Reminder',
    title: 'Update Available',
    message: 'Update Eventix to get the latest features and improvements!',
    platforms: ['ios', 'android'],
    recipients: 12847,
    scheduled: null,
    status: 'draft',
    delivered: 0,
    opened: 0,
    clicked: 0
  }
];

const audienceSegments = [
  { id: 1, name: 'All Users', count: 15234, platforms: ['ios', 'android', 'web'] },
  { id: 2, name: 'iOS Users', count: 8934, platforms: ['ios'] },
  { id: 3, name: 'Android Users', count: 5678, platforms: ['android'] },
  { id: 4, name: 'Web Users', count: 622, platforms: ['web'] },
  { id: 5, name: 'VIP Members', count: 456, platforms: ['ios', 'android', 'web'] },
  { id: 6, name: 'Recent Users', count: 1234, platforms: ['ios', 'android', 'web'] }
];

const platformIcons = {
  ios: DevicePhoneMobileIcon,
  android: DevicePhoneMobileIcon,
  web: ComputerDesktopIcon
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function PushNotifications() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pushComposer, setPushComposer] = useState({
    to: 'all-users',
    title: '',
    message: '',
    template: '',
    scheduledFor: '',
    platforms: ['ios', 'android', 'web'],
    actionUrl: '',
    icon: '',
    image: '',
    badge: 1,
    sound: 'default',
    testToken: ''
  });

  const tabs = [
    { name: 'Compose', icon: PencilIcon },
    { name: 'Templates', icon: DocumentTextIcon },
    { name: 'Campaigns', icon: PaperAirplaneIcon },
    { name: 'Settings', icon: BellIcon },
    { name: 'Analytics', icon: ChartBarIcon }
  ];

  const handleSendPush = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Push notification sent successfully!');
    }, 2000);
  };

  const handleSchedulePush = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Push notification scheduled successfully!');
    }, 1500);
  };

  const handleSendTest = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Test push notification sent!');
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sent: 'bg-purple-100 text-purple-800',
      paused: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || badges.draft;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const togglePlatform = (platform) => {
    setPushComposer(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const calculateReach = () => {
    const selectedSegment = audienceSegments.find(s => 
      s.name.toLowerCase().replace(/ /g, '-') === pushComposer.to
    );
    if (!selectedSegment) return 0;

    const platformUsers = selectedSegment.platforms.filter(p => 
      pushComposer.platforms.includes(p)
    );
    
    return Math.floor(selectedSegment.count * (platformUsers.length / selectedSegment.platforms.length));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Push Notifications</h1>
        <p className="mt-2 text-gray-600">
          Send real-time push notifications to engage your users across all platforms.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <div className="border-b border-gray-200">
            <Tab.List className="flex space-x-8 px-6">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
                    )
                  }
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Tab.Panels>
            {/* Compose Panel */}
            <Tab.Panel className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Audience
                      </label>
                      <select
                        value={pushComposer.to}
                        onChange={(e) => setPushComposer({...pushComposer, to: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {audienceSegments.map(segment => (
                          <option key={segment.id} value={segment.name.toLowerCase().replace(/ /g, '-')}>
                            {segment.name} ({segment.count.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platforms
                      </label>
                      <div className="flex space-x-4">
                        {['ios', 'android', 'web'].map(platform => {
                          const IconComponent = platformIcons[platform];
                          return (
                            <label key={platform} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={pushComposer.platforms.includes(platform)}
                                onChange={() => togglePlatform(platform)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <IconComponent className="ml-2 h-5 w-5 text-gray-400" />
                              <span className="ml-1 text-sm text-gray-700 capitalize">{platform}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template (Optional)
                      </label>
                      <select
                        value={pushComposer.template}
                        onChange={(e) => setPushComposer({...pushComposer, template: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a template</option>
                        {pushTemplates.map(template => (
                          <option key={template.id} value={template.name}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={pushComposer.title}
                        onChange={(e) => setPushComposer({...pushComposer, title: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter notification title..."
                        maxLength={50}
                      />
                      <p className="text-xs text-gray-500 mt-1">{pushComposer.title.length}/50 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={pushComposer.message}
                        onChange={(e) => setPushComposer({...pushComposer, message: e.target.value})}
                        rows={3}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter notification message..."
                        maxLength={120}
                      />
                      <p className="text-xs text-gray-500 mt-1">{pushComposer.message.length}/120 characters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Action URL (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={pushComposer.actionUrl}
                            onChange={(e) => setPushComposer({...pushComposer, actionUrl: e.target.value})}
                            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="https://example.com/page"
                          />
                          <LinkIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon
                        </label>
                        <select
                          value={pushComposer.icon}
                          onChange={(e) => setPushComposer({...pushComposer, icon: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Default</option>
                          <option value="calendar">📅 Calendar</option>
                          <option value="star">⭐ Star</option>
                          <option value="heart">❤️ Heart</option>
                          <option value="ticket">🎫 Ticket</option>
                          <option value="bell">🔔 Bell</option>
                          <option value="fire">🔥 Fire</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Badge Count
                        </label>
                        <input
                          type="number"
                          value={pushComposer.badge}
                          onChange={(e) => setPushComposer({...pushComposer, badge: parseInt(e.target.value) || 0})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          min="0"
                          max="99"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sound
                        </label>
                        <select
                          value={pushComposer.sound}
                          onChange={(e) => setPushComposer({...pushComposer, sound: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="default">Default</option>
                          <option value="chime">Chime</option>
                          <option value="bell">Bell</option>
                          <option value="none">Silent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={pushComposer.scheduledFor}
                          onChange={(e) => setPushComposer({...pushComposer, scheduledFor: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Device Token
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={pushComposer.testToken}
                          onChange={(e) => setPushComposer({...pushComposer, testToken: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Device token for testing..."
                        />
                        <button
                          onClick={handleSendTest}
                          disabled={loading}
                          className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          Test
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={pushComposer.scheduledFor ? handleSchedulePush : handleSendPush}
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : pushComposer.scheduledFor ? (
                          <>
                            <ClockIcon className="h-5 w-5 mr-2" />
                            Schedule Push
                          </>
                        ) : (
                          <>
                            <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                            Send Now
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Save Draft
                      </button>
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
                      
                      {/* Mobile Preview */}
                      <div className="bg-gray-800 rounded-lg p-3 mb-4">
                        <div className="bg-white rounded p-3 shadow">
                          <div className="flex items-start space-x-2">
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-xs text-white">
                                E
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-900 truncate">
                                Eventix {pushComposer.icon}
                              </div>
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {pushComposer.title || 'Notification Title'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {pushComposer.message || 'Your notification message will appear here...'}
                              </div>
                            </div>
                            {pushComposer.badge > 0 && (
                              <div className="flex-shrink-0">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                                  {pushComposer.badge}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Web Preview */}
                      <div className="border rounded p-3">
                        <div className="text-xs text-gray-500 mb-2">Web Notification</div>
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-indigo-600 rounded-sm flex-shrink-0 mt-0.5"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {pushComposer.title || 'Notification Title'}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {pushComposer.message || 'Your notification message...'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Delivery Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Estimated Reach:</span>
                          <span className="text-sm font-medium">{calculateReach().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Platforms:</span>
                          <span className="text-sm font-medium">{pushComposer.platforms.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Expected Open Rate:</span>
                          <span className="text-sm font-medium">18.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Expected CTR:</span>
                          <span className="text-sm font-medium">4.2%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex">
                        <BellIcon className="h-5 w-5 text-blue-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Push Best Practices</h4>
                          <ul className="text-xs text-blue-700 mt-1 space-y-1">
                            <li>• Keep titles under 50 characters</li>
                            <li>• Messages should be under 120 characters</li>
                            <li>• Use emojis sparingly and meaningfully</li>
                            <li>• Test on different devices</li>
                            <li>• Schedule for optimal engagement times</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Templates Panel */}
            <Tab.Panel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <select className="block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">All Categories</option>
                    <option value="event-notifications">Event Notifications</option>
                    <option value="promotional">Promotional</option>
                    <option value="user-onboarding">User Onboarding</option>
                    <option value="transactional">Transactional</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pushTemplates.map((template) => (
                  <div key={template.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                        <span className={classNames(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          getStatusBadge(template.status)
                        )}>
                          {template.status}
                        </span>
                      </div>
                      
                      {/* Template Preview */}
                      <div className="bg-gray-50 rounded p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <div className="w-5 h-5 bg-indigo-600 rounded flex-shrink-0 mt-0.5"></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {template.title}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {template.message}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span>{template.category}</span>
                        <span>{formatDate(template.lastUsed)}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 mb-4">
                        <div>
                          <div className="font-medium text-gray-900">{template.delivered.toLocaleString()}</div>
                          <div>Delivered</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{template.opened.toLocaleString()}</div>
                          <div>Opened</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{template.clicked.toLocaleString()}</div>
                          <div>Clicked</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Preview
                        </button>
                        <button className="flex-1 inline-flex items-center justify-center px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700">
                          Use Template
                        </button>
                        <button className="px-2 py-1 text-gray-400 hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {/* Campaigns Panel */}
            <Tab.Panel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <select className="block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                  </select>
                </div>
                <button
                  onClick={() => setSelectedTab(0)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Campaign
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {pushCampaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <div className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900">{campaign.name}</h3>
                              <span className={classNames(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                getStatusBadge(campaign.status)
                              )}>
                                {campaign.status}
                              </span>
                            </div>
                            <div className="mt-2">
                              <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                              <p className="text-sm text-gray-600">{campaign.message}</p>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                {campaign.recipients.toLocaleString()} recipients
                              </span>
                              <div className="flex items-center space-x-1">
                                {campaign.platforms.map(platform => {
                                  const IconComponent = platformIcons[platform];
                                  return <IconComponent key={platform} className="h-4 w-4" />;
                                })}
                              </div>
                              {campaign.status === 'scheduled' && campaign.scheduled && (
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {formatDate(campaign.scheduled)}
                                </span>
                              )}
                              {campaign.status === 'sent' && (
                                <>
                                  <span>{campaign.delivered.toLocaleString()} delivered</span>
                                  <span>{campaign.opened.toLocaleString()} opened</span>
                                  <span>{campaign.clicked.toLocaleString()} clicked</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {campaign.status === 'draft' && (
                              <button className="p-1 text-gray-400 hover:text-gray-600">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Tab.Panel>

            {/* Settings Panel */}
            <Tab.Panel className="p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Push Notification Settings</h2>
                  <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Default Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Enable Badge Count</div>
                            <div className="text-xs text-gray-500">Show unread count on app icon</div>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Default Sound</div>
                            <div className="text-xs text-gray-500">Sound to play for notifications</div>
                          </div>
                          <select className="block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="default">Default</option>
                            <option value="chime">Chime</option>
                            <option value="bell">Bell</option>
                            <option value="none">Silent</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Platform Configurations</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">iOS (APNs)</span>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Connected
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Certificate expires: March 15, 2025
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">Android (FCM)</span>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Connected
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Server key configured
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">Web Push</span>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Connected
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            VAPID keys configured
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Delivery Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Retry Failed Deliveries</div>
                            <div className="text-xs text-gray-500">Automatically retry failed push notifications</div>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">Rate Limiting</div>
                            <div className="text-xs text-gray-500">Maximum notifications per user per hour</div>
                          </div>
                          <input
                            type="number"
                            defaultValue="10"
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>

            {/* Analytics Panel */}
            <Tab.Panel className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">15,234</div>
                  <div className="text-sm text-gray-500">Push Subscribers</div>
                  <div className="text-xs text-green-600 mt-1">+8% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">94.2%</div>
                  <div className="text-sm text-gray-500">Delivery Rate</div>
                  <div className="text-xs text-green-600 mt-1">+1.2% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">18.5%</div>
                  <div className="text-sm text-gray-500">Open Rate</div>
                  <div className="text-xs text-red-600 mt-1">-0.8% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">4.2%</div>
                  <div className="text-sm text-gray-500">Click Through Rate</div>
                  <div className="text-xs text-green-600 mt-1">+0.3% from last month</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Push Performance</h3>
                  <div className="h-64 flex items-center justify-center border border-gray-200 rounded">
                    <span className="text-gray-500">Chart placeholder - Push notification performance over time</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">iOS</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">8,934</div>
                        <div className="text-xs text-gray-500">58.7%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">Android</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">5,678</div>
                        <div className="text-xs text-gray-500">37.3%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">Web</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">622</div>
                        <div className="text-xs text-gray-500">4.0%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

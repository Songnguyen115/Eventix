import { useState } from 'react';
import { Tab } from '@headlessui/react';
import {
  DevicePhoneMobileIcon,
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
  TrashIcon
} from '@heroicons/react/24/outline';

const smsTemplates = [
  {
    id: 1,
    name: 'Event Reminder',
    message: 'Hi {{name}}! Don\'t forget: {{event}} starts in 1 hour. See you there!',
    category: 'Event Notifications',
    status: 'active',
    lastUsed: '2024-03-15T10:30:00Z',
    deliveryRate: 98.5,
    responseRate: 12.3
  },
  {
    id: 2,
    name: 'Ticket Confirmation',
    message: 'Your ticket for {{event}} is confirmed! Show this message at the entrance. Ticket ID: {{ticket_id}}',
    category: 'Transactional',
    status: 'active',
    lastUsed: '2024-03-14T15:45:00Z',
    deliveryRate: 99.2,
    responseRate: 5.8
  },
  {
    id: 3,
    name: 'Welcome SMS',
    message: 'Welcome to Eventix, {{name}}! We\'re excited to have you. Reply STOP to opt out.',
    category: 'User Onboarding',
    status: 'active',
    lastUsed: '2024-03-13T09:20:00Z',
    deliveryRate: 97.8,
    responseRate: 8.4
  },
  {
    id: 4,
    name: 'Password Reset',
    message: 'Your Eventix password reset code is: {{code}}. This code expires in 10 minutes.',
    category: 'Security',
    status: 'active',
    lastUsed: '2024-03-12T14:15:00Z',
    deliveryRate: 99.5,
    responseRate: 2.1
  }
];

const smsCampaigns = [
  {
    id: 1,
    name: 'Event Reminder Blast',
    message: 'Don\'t forget about tomorrow\'s Tech Conference! Doors open at 9 AM.',
    recipients: 1247,
    scheduled: '2024-03-16T08:00:00Z',
    status: 'scheduled',
    delivered: 0,
    failed: 0,
    cost: 62.35
  },
  {
    id: 2,
    name: 'Welcome New Users',
    message: 'Welcome to Eventix! Discover amazing events happening near you.',
    recipients: 234,
    scheduled: null,
    status: 'sent',
    delivered: 229,
    failed: 5,
    cost: 11.70,
    sentAt: '2024-03-14T10:00:00Z'
  },
  {
    id: 3,
    name: 'VIP Early Access',
    message: 'VIP exclusive: Get early access to Music Festival tickets. Book now!',
    recipients: 89,
    scheduled: null,
    status: 'draft',
    delivered: 0,
    failed: 0,
    cost: 4.45
  }
];

const phoneNumbers = [
  { id: 1, number: '+1 (555) 123-4567', type: 'Toll-free', status: 'active', verified: true },
  { id: 2, number: '+1 (555) 234-5678', type: 'Local', status: 'active', verified: true },
  { id: 3, number: '+1 (555) 345-6789', type: 'Short code', status: 'pending', verified: false }
];

const audienceSegments = [
  { id: 1, name: 'All Users with SMS', count: 8934 },
  { id: 2, name: 'Event Attendees', count: 2341 },
  { id: 3, name: 'VIP Members', count: 456 },
  { id: 4, name: 'Recent Signups', count: 789 }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SMSNotifications() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [smsComposer, setSmsComposer] = useState({
    to: 'all-users-with-sms',
    message: '',
    template: '',
    scheduledFor: '',
    fromNumber: '+1 (555) 123-4567',
    testNumber: ''
  });

  const tabs = [
    { name: 'Compose', icon: PencilIcon },
    { name: 'Templates', icon: DocumentTextIcon },
    { name: 'Campaigns', icon: PaperAirplaneIcon },
    { name: 'Phone Numbers', icon: DevicePhoneMobileIcon },
    { name: 'Analytics', icon: ChartBarIcon }
  ];

  const handleSendSMS = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('SMS sent successfully!');
    }, 2000);
  };

  const handleScheduleSMS = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('SMS scheduled successfully!');
    }, 1500);
  };

  const handleSendTest = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Test SMS sent!');
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sent: 'bg-purple-100 text-purple-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
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

  const calculateCharacterCount = (message) => {
    return message.length;
  };

  const calculateMessageParts = (message) => {
    return Math.ceil(message.length / 160);
  };

  const calculateEstimatedCost = (recipients, messageParts) => {
    const costPerSMS = 0.05; // $0.05 per SMS
    return (recipients * messageParts * costPerSMS).toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SMS Notifications</h1>
        <p className="mt-2 text-gray-600">
          Send SMS messages to your users for important notifications and updates.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipients
                        </label>
                        <select
                          value={smsComposer.to}
                          onChange={(e) => setSmsComposer({...smsComposer, to: e.target.value})}
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
                          From Number
                        </label>
                        <select
                          value={smsComposer.fromNumber}
                          onChange={(e) => setSmsComposer({...smsComposer, fromNumber: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {phoneNumbers.filter(num => num.status === 'active').map(number => (
                            <option key={number.id} value={number.number}>
                              {number.number} ({number.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template (Optional)
                      </label>
                      <select
                        value={smsComposer.template}
                        onChange={(e) => setSmsComposer({...smsComposer, template: e.target.value})}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select a template</option>
                        {smsTemplates.map(template => (
                          <option key={template.id} value={template.name}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <div className="text-xs text-gray-500">
                          {calculateCharacterCount(smsComposer.message)}/160 chars
                          {calculateMessageParts(smsComposer.message) > 1 && 
                            ` (${calculateMessageParts(smsComposer.message)} parts)`
                          }
                        </div>
                      </div>
                      <textarea
                        value={smsComposer.message}
                        onChange={(e) => setSmsComposer({...smsComposer, message: e.target.value})}
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Type your SMS message here..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use variables like {'{{name}}'}, {'{{event}}'}, {'{{code}}'}, etc.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule For (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={smsComposer.scheduledFor}
                          onChange={(e) => setSmsComposer({...smsComposer, scheduledFor: e.target.value})}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Test Number
                        </label>
                        <div className="flex">
                          <input
                            type="tel"
                            value={smsComposer.testNumber}
                            onChange={(e) => setSmsComposer({...smsComposer, testNumber: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="+1 (555) 123-4567"
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
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={smsComposer.scheduledFor ? handleScheduleSMS : handleSendSMS}
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : smsComposer.scheduledFor ? (
                          <>
                            <ClockIcon className="h-5 w-5 mr-2" />
                            Schedule SMS
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

                  {/* Preview & Stats Panel */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
                      <div className="bg-white rounded border p-3">
                        <div className="text-xs text-gray-500 mb-2">From: {smsComposer.fromNumber}</div>
                        <div className="text-sm">
                          {smsComposer.message || 'Your message will appear here...'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Message Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Characters:</span>
                          <span className="text-sm font-medium">
                            {calculateCharacterCount(smsComposer.message)}/160
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Message Parts:</span>
                          <span className="text-sm font-medium">
                            {calculateMessageParts(smsComposer.message)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Recipients:</span>
                          <span className="text-sm font-medium">
                            {audienceSegments.find(s => s.name.toLowerCase().replace(/ /g, '-') === smsComposer.to)?.count?.toLocaleString() || '0'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Est. Cost:</span>
                          <span className="text-sm font-medium">
                            ${calculateEstimatedCost(
                              audienceSegments.find(s => s.name.toLowerCase().replace(/ /g, '-') === smsComposer.to)?.count || 0,
                              calculateMessageParts(smsComposer.message)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">SMS Guidelines</h4>
                          <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                            <li>• Keep messages under 160 characters</li>
                            <li>• Include opt-out instructions</li>
                            <li>• Avoid promotional content after 9 PM</li>
                            <li>• Always identify your organization</li>
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
                    <option value="transactional">Transactional</option>
                    <option value="user-onboarding">User Onboarding</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  New Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {smsTemplates.map((template) => (
                  <div key={template.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                      <span className={classNames(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                        getStatusBadge(template.status)
                      )}>
                        {template.status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 mb-4">
                      <div className="text-sm text-gray-900">{template.message}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{template.category}</span>
                      <span>{template.message.length} chars</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 mb-4">
                      <div>
                        <div className="font-medium text-gray-900">{template.deliveryRate}%</div>
                        <div>Delivery Rate</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{template.responseRate}%</div>
                        <div>Response Rate</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button className="flex-1 inline-flex items-center justify-center px-3 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700">
                        Use Template
                      </button>
                      <button className="px-2 py-1 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
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
                  {smsCampaigns.map((campaign) => (
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
                            <p className="text-sm text-gray-600 mt-1">{campaign.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center">
                                <UserGroupIcon className="h-4 w-4 mr-1" />
                                {campaign.recipients.toLocaleString()} recipients
                              </span>
                              <span>${campaign.cost}</span>
                              {campaign.status === 'scheduled' && campaign.scheduled && (
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {formatDate(campaign.scheduled)}
                                </span>
                              )}
                              {campaign.status === 'sent' && (
                                <>
                                  <span className="text-green-600">{campaign.delivered} delivered</span>
                                  {campaign.failed > 0 && (
                                    <span className="text-red-600">{campaign.failed} failed</span>
                                  )}
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

            {/* Phone Numbers Panel */}
            <Tab.Panel className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Phone Numbers</h2>
                  <p className="text-sm text-gray-500">Manage your SMS sender phone numbers</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Number
                </button>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {phoneNumbers.map((number) => (
                    <li key={number.id}>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900">{number.number}</h3>
                              <span className="text-sm text-gray-500">({number.type})</span>
                              {number.verified ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircleIcon className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              <span className={classNames(
                                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                                getStatusBadge(number.status)
                              )}>
                                {number.status}
                              </span>
                              <span>{number.verified ? 'Verified' : 'Not verified'}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!number.verified && (
                              <button className="text-sm text-indigo-600 hover:text-indigo-500">
                                Verify
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <PencilIcon className="h-4 w-4" />
                            </button>
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

            {/* Analytics Panel */}
            <Tab.Panel className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">8,934</div>
                  <div className="text-sm text-gray-500">SMS Subscribers</div>
                  <div className="text-xs text-green-600 mt-1">+5% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">98.2%</div>
                  <div className="text-sm text-gray-500">Delivery Rate</div>
                  <div className="text-xs text-green-600 mt-1">+0.3% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">8.7%</div>
                  <div className="text-sm text-gray-500">Response Rate</div>
                  <div className="text-xs text-red-600 mt-1">-0.5% from last month</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">$247.85</div>
                  <div className="text-sm text-gray-500">Monthly Cost</div>
                  <div className="text-xs text-green-600 mt-1">-12% from last month</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Performance</h3>
                  <div className="h-64 flex items-center justify-center border border-gray-200 rounded">
                    <span className="text-gray-500">Chart placeholder - SMS delivery and response rates</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Templates</h3>
                  <div className="space-y-4">
                    {smsTemplates.slice(0, 4).map((template, index) => (
                      <div key={template.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          <div className="text-xs text-gray-500">{template.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{template.responseRate}%</div>
                          <div className="text-xs text-gray-500">Response Rate</div>
                        </div>
                      </div>
                    ))}
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

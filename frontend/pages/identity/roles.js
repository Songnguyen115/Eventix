import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const initialRoles = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    permissions: ['all'],
    userCount: 2,
    color: 'red',
    system: true
  },
  {
    id: 2,
    name: 'Event Organizer',
    description: 'Can create and manage events, view analytics',
    permissions: ['events.create', 'events.update', 'events.delete', 'analytics.view', 'tickets.manage'],
    userCount: 15,
    color: 'blue',
    system: false
  },
  {
    id: 3,
    name: 'Content Manager',
    description: 'Manages content, media, and SEO settings',
    permissions: ['content.create', 'content.update', 'content.delete', 'media.manage', 'seo.manage'],
    userCount: 8,
    color: 'green',
    system: false
  },
  {
    id: 4,
    name: 'Marketing Team',
    description: 'Handles notifications and promotional content',
    permissions: ['notifications.send', 'content.create', 'analytics.view'],
    userCount: 12,
    color: 'purple',
    system: false
  },
  {
    id: 5,
    name: 'Support Agent',
    description: 'Customer support with limited access',
    permissions: ['users.view', 'tickets.view', 'checkin.manage'],
    userCount: 6,
    color: 'yellow',
    system: false
  },
  {
    id: 6,
    name: 'Regular User',
    description: 'Standard user with basic permissions',
    permissions: ['profile.update', 'events.view', 'tickets.purchase'],
    userCount: 1247,
    color: 'gray',
    system: true
  }
];

const availablePermissions = [
  { category: 'Users & Identity', permissions: [
    'users.view', 'users.create', 'users.update', 'users.delete',
    'roles.view', 'roles.create', 'roles.update', 'roles.delete'
  ]},
  { category: 'Events', permissions: [
    'events.view', 'events.create', 'events.update', 'events.delete',
    'events.publish', 'events.categories'
  ]},
  { category: 'Content & Media', permissions: [
    'content.view', 'content.create', 'content.update', 'content.delete',
    'media.upload', 'media.manage', 'seo.manage'
  ]},
  { category: 'Tickets & Payments', permissions: [
    'tickets.view', 'tickets.manage', 'tickets.refund',
    'payments.view', 'payments.process', 'invoices.generate'
  ]},
  { category: 'Check-in & Analytics', permissions: [
    'checkin.manage', 'attendance.track', 'sponsor.manage',
    'analytics.view', 'reports.generate', 'surveys.manage'
  ]},
  { category: 'Notifications', permissions: [
    'notifications.send', 'notifications.email', 'notifications.sms', 'notifications.push'
  ]},
  { category: 'System', permissions: [
    'system.settings', 'system.backup', 'system.logs', 'all'
  ]}
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function RoleManagement() {
  const [roles, setRoles] = useState(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
    permissions: []
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    setFormData({ name: '', description: '', color: 'blue', permissions: [] });
    setIsCreateModalOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: role.permissions
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === selectedRole.id 
          ? { ...role, ...formData }
          : role
      ));
    } else {
      // Create new role
      const newRole = {
        id: Math.max(...roles.map(r => r.id)) + 1,
        ...formData,
        userCount: 0,
        system: false
      };
      setRoles([...roles, newRole]);
    }
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const handleConfirmDelete = () => {
    setRoles(roles.filter(role => role.id !== selectedRole.id));
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const togglePermission = (permission) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="mt-2 text-gray-600">
              Create and manage user roles with specific permissions.
            </p>
          </div>
          <button
            onClick={handleCreateRole}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Role
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getColorClasses(role.color).replace('bg-', 'bg-').replace(' text-', ' ').replace(' border-', ' ')}`}></div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  {role.system && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      System
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  {!role.system && (
                    <button
                      onClick={() => handleDeleteRole(role)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{role.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-1" />
                  {role.userCount} users
                </div>
                <div className="flex items-center text-gray-500">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  {role.permissions.includes('all') ? 'All permissions' : `${role.permissions.length} permissions`}
                </div>
              </div>

              {/* Permissions Preview */}
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Permissions:</div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <span key={permission} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {permission}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Role Modal */}
      <Transition appear show={isCreateModalOpen || isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-6">
                    {selectedRole ? 'Edit Role' : 'Create New Role'}
                  </Dialog.Title>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter role name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter role description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <div className="flex space-x-2">
                          {['red', 'blue', 'green', 'purple', 'yellow', 'gray'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setFormData({ ...formData, color })}
                              className={classNames(
                                'w-8 h-8 rounded-full border-2',
                                formData.color === color ? 'border-gray-900' : 'border-gray-300',
                                `bg-${color}-500`
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md p-4">
                        {availablePermissions.map((category) => (
                          <div key={category.category} className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                            <div className="space-y-2">
                              {category.permissions.map((permission) => (
                                <label key={permission} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions.includes(permission)}
                                    onChange={() => togglePermission(permission)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">{permission}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsEditModalOpen(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveRole}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      {selectedRole ? 'Update Role' : 'Create Role'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3" />
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Delete Role
                    </Dialog.Title>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.
                      {selectedRole?.userCount > 0 && (
                        <span className="block mt-2 text-red-600 font-medium">
                          Warning: This role is currently assigned to {selectedRole.userCount} users.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete Role
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

import { useState } from 'react';
import {
  TagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const initialCategories = [
  { id: 1, name: 'Technology', description: 'Tech conferences, workshops, and seminars', eventCount: 45, color: 'blue', active: true },
  { id: 2, name: 'Business', description: 'Business meetings, networking events', eventCount: 32, color: 'green', active: true },
  { id: 3, name: 'Arts', description: 'Art exhibitions, cultural events', eventCount: 28, color: 'purple', active: true },
  { id: 4, name: 'Music', description: 'Concerts, festivals, music events', eventCount: 67, color: 'red', active: true },
  { id: 5, name: 'Sports', description: 'Sports events, tournaments', eventCount: 23, color: 'yellow', active: true },
  { id: 6, name: 'Education', description: 'Educational workshops, courses', eventCount: 19, color: 'indigo', active: false }
];

export default function EventCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColorClasses = (color, active) => {
    const colors = {
      blue: active ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200',
      green: active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200',
      purple: active ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-gray-100 text-gray-500 border-gray-200',
      red: active ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-500 border-gray-200',
      yellow: active ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200',
      indigo: active ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-gray-100 text-gray-500 border-gray-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Categories</h1>
            <p className="mt-2 text-gray-600">
              Organize your events into categories for better management.
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          <div className="text-sm text-gray-500">Total Categories</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.active).length}
          </div>
          <div className="text-sm text-gray-500">Active Categories</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">
            {categories.reduce((sum, c) => sum + c.eventCount, 0)}
          </div>
          <div className="text-sm text-gray-500">Total Events</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <TagIcon className={`h-6 w-6 ${category.active ? 'text-indigo-600' : 'text-gray-400'}`} />
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {category.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{category.eventCount}</span> events
              </div>
              <div className={`w-4 h-4 rounded-full ${getColorClasses(category.color, category.active).replace('bg-', 'bg-').replace(' text-', ' ').replace(' border-', ' ')}`}></div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex-1 inline-flex items-center justify-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50">
                <EyeIcon className="h-4 w-4 mr-1" />
                View Events
              </button>
              <button className="px-2 py-1 text-gray-400 hover:text-indigo-600">
                <PencilIcon className="h-4 w-4" />
              </button>
              <button className="px-2 py-1 text-gray-400 hover:text-red-600">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

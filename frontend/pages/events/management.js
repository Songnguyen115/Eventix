export default function EventManagement() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <p className="mt-2 text-gray-600">
              Tạo, quản lý và tổ chức các sự kiện của bạn.
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            + Tạo sự kiện mới
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">245</div>
          <div className="text-sm text-gray-500">Tổng sự kiện</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-sm text-gray-500">Đang diễn ra</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">89,432</div>
          <div className="text-sm text-gray-500">Tổng người tham gia</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">$2,847,392</div>
          <div className="text-sm text-gray-500">Doanh thu</div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tech Conference 2024</h3>
          <p className="text-gray-600 text-sm mb-4">Ngày: 15/04/2024</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Đang diễn ra
            </span>
            <span className="text-sm text-gray-500">450 người tham gia</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Music Festival</h3>
          <p className="text-gray-600 text-sm mb-4">Ngày: 20/04/2024</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Sắp tới
            </span>
            <span className="text-sm text-gray-500">1,200 người tham gia</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Summit</h3>
          <p className="text-gray-600 text-sm mb-4">Ngày: 28/02/2024</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Hoàn thành
            </span>
            <span className="text-sm text-gray-500">300 người tham gia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
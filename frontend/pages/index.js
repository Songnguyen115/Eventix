export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eventix Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Chào mừng bạn đến với hệ thống quản lý sự kiện Eventix!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">245</div>
          <div className="text-sm text-gray-500">Tổng số sự kiện</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">12,847</div>
          <div className="text-sm text-gray-500">Người dùng hoạt động</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">89,432</div>
          <div className="text-sm text-gray-500">Vé đã bán</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">$2,847,392</div>
          <div className="text-sm text-gray-500">Doanh thu</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo sự kiện</h3>
            <p className="text-sm text-gray-500 mb-4">Tạo một sự kiện mới</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Tạo ngay
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý người dùng</h3>
            <p className="text-sm text-gray-500 mb-4">Quản lý tài khoản người dùng</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Xem chi tiết
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gửi thông báo</h3>
            <p className="text-sm text-gray-500 mb-4">Gửi thông báo đến người dùng</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Gửi ngay
            </button>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Trạng thái dịch vụ</h2>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Identity Service', status: 'hoạt động' },
              { name: 'Notification Service', status: 'hoạt động' },
              { name: 'Event Service', status: 'hoạt động' },
              { name: 'Content Service', status: 'hoạt động' },
              { name: 'Ticket Service', status: 'hoạt động' },
              { name: 'Payment Service', status: 'bảo trì' },
              { name: 'Check-in Service', status: 'hoạt động' },
              { name: 'Analytics Service', status: 'hoạt động' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-md">
                <span className="text-sm font-medium text-gray-900">{service.name}</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  service.status === 'hoạt động'
                    ? 'bg-green-100 text-green-800'
                    : service.status === 'bảo trì'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
        </div>
  );
}
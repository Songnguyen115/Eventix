export default function EmailNotifications() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Notifications</h1>
        <p className="mt-2 text-gray-600">
          Tạo và gửi thông báo email đến người dùng của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Composer */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Soạn Email</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Người nhận</label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option>Tất cả người dùng (12,847)</option>
                <option>Người tổ chức sự kiện (234)</option>
                <option>Thành viên VIP (456)</option>
                <option>Người dùng mới (1,234)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập tiêu đề email..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
              <textarea
                rows={8}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nhập nội dung email..."
              />
            </div>
            <div className="flex space-x-4">
              <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Gửi ngay
              </button>
              <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700">
                Lưu nháp
              </button>
            </div>
          </form>
        </div>

        {/* Email Templates */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
          <div className="space-y-4">
            {[
              { name: 'Chào mừng người dùng mới', usage: 1247 },
              { name: 'Nhắc nhở sự kiện', usage: 892 },
              { name: 'Xác nhận vé', usage: 1456 },
              { name: 'Đặt lại mật khẩu', usage: 234 }
            ].map((template, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-500">Đã sử dụng {template.usage.toLocaleString()} lần</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm">Sử dụng</button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">Sửa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">12,847</div>
          <div className="text-sm text-gray-500">Email subscribers</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">24.5%</div>
          <div className="text-sm text-gray-500">Tỷ lệ mở email</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">3.2%</div>
          <div className="text-sm text-gray-500">Tỷ lệ click</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">456</div>
          <div className="text-sm text-gray-500">Email gửi hôm nay</div>
        </div>
      </div>
    </div>
  );
}
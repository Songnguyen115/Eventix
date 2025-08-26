export default function Authentication() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Authentication</h1>
        <p className="mt-2 text-gray-600">
          Quản lý xác thực người dùng, đăng nhập, đăng ký và bảo mật tài khoản.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Login Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng nhập</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="nhap@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Đăng nhập
            </button>
          </form>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Đăng ký</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nguyen Van A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="nhap@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              Đăng ký
            </button>
          </form>
        </div>

        {/* 2FA Setup */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bảo mật 2FA</h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 mx-auto rounded-lg flex items-center justify-center mb-4">
                <span className="text-gray-500">QR Code</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Quét mã QR này bằng ứng dụng Google Authenticator
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã xác thực</label>
              <input
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="123456"
              />
            </div>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">
              Kích hoạt 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">12,847</div>
          <div className="text-sm text-gray-500">Tổng người dùng</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">8,234</div>
          <div className="text-sm text-gray-500">Đã xác thực</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">3,456</div>
          <div className="text-sm text-gray-500">Bật 2FA</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">1,157</div>
          <div className="text-sm text-gray-500">Đăng nhập hôm nay</div>
        </div>
      </div>
    </div>
  );
}
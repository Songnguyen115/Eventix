import { useState, useEffect } from 'react';

// Mock data - sẽ thay thế bằng API calls đến backend
const mockReportsData = {
  eventReports: [
    {
      id: 1,
      eventName: 'Tech Conference 2024',
      eventDate: '2024-03-15',
      totalRegistered: 450,
      totalCheckedIn: 287,
      totalRevenue: 134550,
      averageRating: 4.7,
      attendanceRate: 63.8,
      demographics: {
        ageGroups: [
          { range: '18-25', count: 89, percentage: 31.0 },
          { range: '26-35', count: 145, percentage: 50.5 },
          { range: '36-45', count: 42, percentage: 14.6 },
          { range: '46+', count: 11, percentage: 3.8 }
        ],
        gender: [
          { type: 'Nam', count: 172, percentage: 59.9 },
          { type: 'Nữ', count: 115, percentage: 40.1 }
        ],
        locations: [
          { city: 'Hồ Chí Minh', count: 156, percentage: 54.4 },
          { city: 'Hà Nội', count: 89, percentage: 31.0 },
          { city: 'Đà Nẵng', count: 25, percentage: 8.7 },
          { city: 'Khác', count: 17, percentage: 5.9 }
        ]
      },
      feedback: {
        totalResponses: 234,
        averageRating: 4.7,
        categories: [
          { name: 'Nội dung', rating: 4.8 },
          { name: 'Tổ chức', rating: 4.6 },
          { name: 'Địa điểm', rating: 4.5 },
          { name: 'Dịch vụ', rating: 4.7 }
        ]
      },
      timeAnalysis: {
        checkInPeaks: [
          { time: '08:30-09:00', count: 45 },
          { time: '09:00-09:30', count: 67 },
          { time: '09:30-10:00', count: 89 },
          { time: '10:00-10:30', count: 56 },
          { time: '10:30-11:00', count: 30 }
        ],
        sessionAttendance: [
          { session: 'Keynote', attendance: 287, capacity: 300 },
          { session: 'Workshop A', attendance: 156, capacity: 200 },
          { session: 'Workshop B', attendance: 134, capacity: 200 },
          { session: 'Panel Discussion', attendance: 245, capacity: 300 }
        ]
      }
    }
  ],
  overallStats: {
    totalEvents: 245,
    totalAttendees: 89432,
    totalRevenue: 2847392,
    averageEventRating: 4.6,
    repeatAttendeeRate: 34.5,
    cancellationRate: 5.2
  },
  trendsData: {
    monthlyEvents: [
      { month: 'T1', events: 18, attendees: 6543 },
      { month: 'T2', events: 22, attendees: 7892 },
      { month: 'T3', events: 25, attendees: 8934 },
      { month: 'T4', events: 28, attendees: 9876 },
      { month: 'T5', events: 31, attendees: 10234 },
      { month: 'T6', events: 29, attendees: 9567 }
    ],
    categoryPerformance: [
      { category: 'Technology', events: 89, avgAttendance: 234, revenue: 1234567 },
      { category: 'Business', events: 67, avgAttendance: 189, revenue: 987654 },
      { category: 'Arts', events: 45, avgAttendance: 156, revenue: 456789 },
      { category: 'Music', events: 34, avgAttendance: 678, revenue: 876543 },
      { category: 'Education', events: 23, avgAttendance: 123, revenue: 234567 }
    ]
  }
};

export default function AnalyticsReports() {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [selectedEvent, setSelectedEvent] = useState(1);
  const [dateRange, setDateRange] = useState('last30days');
  const [reportData, setReportData] = useState(mockReportsData);
  const [loading, setLoading] = useState(false);

  // Simulate API call to backend
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      // TODO: Replace with actual API call to backend
      // const response = await fetch(`/api/analytics/reports?type=${selectedReport}&dateRange=${dateRange}`);
      // const data = await response.json();
      // setReportData(data);
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchReportData();
  }, [selectedReport, dateRange]);

  const currentEventReport = reportData.eventReports.find(r => r.id === selectedEvent);

  const exportReport = (format) => {
    // TODO: Call backend API to generate and download report
    alert(`Đang xuất báo cáo dạng ${format}...`);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Reports</h1>
            <p className="mt-2 text-gray-600">
              Báo cáo chi tiết và phân tích dữ liệu sự kiện.
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="last7days">7 ngày qua</option>
              <option value="last30days">30 ngày qua</option>
              <option value="last3months">3 tháng qua</option>
              <option value="lastyear">Năm qua</option>
            </select>
            <button
              onClick={() => exportReport('PDF')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              📄 Xuất PDF
            </button>
            <button
              onClick={() => exportReport('Excel')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              📊 Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Tổng quan' },
              { id: 'events', name: 'Báo cáo sự kiện' },
              { id: 'demographics', name: 'Thống kê người tham gia' },
              { id: 'revenue', name: 'Doanh thu' },
              { id: 'trends', name: 'Xu hướng' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedReport === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div>
          {/* Overview Report */}
          {selectedReport === 'overview' && (
            <div>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-gray-900">
                    {reportData.overallStats.totalEvents}
                  </div>
                  <div className="text-sm text-gray-500">Tổng số sự kiện</div>
                  <div className="text-xs text-green-600 mt-1">+12% so với kỳ trước</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {reportData.overallStats.totalAttendees.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Tổng người tham gia</div>
                  <div className="text-xs text-green-600 mt-1">+8% so với kỳ trước</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-green-600">
                    ${reportData.overallStats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Tổng doanh thu</div>
                  <div className="text-xs text-green-600 mt-1">+15% so với kỳ trước</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-2xl font-bold text-purple-600">
                    {reportData.overallStats.averageEventRating}
                  </div>
                  <div className="text-sm text-gray-500">Đánh giá trung bình</div>
                  <div className="text-xs text-green-600 mt-1">+0.2 điểm</div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Xu hướng sự kiện theo tháng</h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">📊</div>
                      <p className="text-gray-500">Biểu đồ xu hướng sự kiện</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Phân bổ theo danh mục</h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">🥧</div>
                      <p className="text-gray-500">Biểu đồ tròn danh mục</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Event Specific Report */}
          {selectedReport === 'events' && currentEventReport && (
            <div>
              <div className="mb-6">
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {reportData.eventReports.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.eventName} - {event.eventDate}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Summary */}
              <div className="bg-white rounded-lg shadow mb-6 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{currentEventReport.eventName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentEventReport.totalRegistered}</div>
                    <div className="text-sm text-gray-500">Đăng ký</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentEventReport.totalCheckedIn}</div>
                    <div className="text-sm text-gray-500">Check-in</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{currentEventReport.attendanceRate}%</div>
                    <div className="text-sm text-gray-500">Tỷ lệ tham gia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">${currentEventReport.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Doanh thu</div>
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Phân bố độ tuổi</h4>
                  <div className="space-y-3">
                    {currentEventReport.demographics.ageGroups.map((group, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-16 text-sm text-gray-600">{group.range}</div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full" 
                              style={{ width: `${group.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-sm font-medium text-gray-900 text-right">
                          {group.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Phân bố địa lý</h4>
                  <div className="space-y-3">
                    {currentEventReport.demographics.locations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{location.city}</div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{location.count}</div>
                          <div className="text-xs text-gray-500">{location.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feedback Analysis */}
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Phân tích đánh giá ({currentEventReport.feedback.totalResponses} phản hồi)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {currentEventReport.feedback.categories.map((category, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{category.rating}/5</div>
                      <div className="text-sm text-gray-500">{category.name}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(category.rating / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other report types can be added here */}
          {selectedReport !== 'overview' && selectedReport !== 'events' && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Báo cáo {selectedReport} đang được phát triển
              </h3>
              <p className="text-gray-600">
                Tính năng này sẽ sớm được cập nhật với dữ liệu từ backend.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

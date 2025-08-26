import { useState, useEffect } from 'react';
import { analyticsService } from '../../services/api';

// Mock survey data - sẽ thay thế bằng API calls
const mockSurveysData = [
  {
    id: 1,
    title: 'Đánh giá sự kiện Tech Conference 2024',
    eventId: 1,
    eventName: 'Tech Conference 2024',
    status: 'active',
    createdAt: '2024-03-10T10:00:00Z',
    endDate: '2024-03-20T23:59:59Z',
    totalResponses: 234,
    targetResponses: 300,
    questions: [
      { id: 1, type: 'rating', question: 'Bạn đánh giá chất lượng nội dung như thế nào?', required: true },
      { id: 2, type: 'rating', question: 'Bạn hài lòng với việc tổ chức sự kiện?', required: true },
      { id: 3, type: 'multiple_choice', question: 'Bạn biết đến sự kiện qua kênh nào?', required: false },
      { id: 4, type: 'text', question: 'Góp ý để cải thiện sự kiện tương lai', required: false }
    ],
    results: {
      averageRating: 4.7,
      responseRate: 78,
      satisfaction: 92,
      nps: 67
    }
  },
  {
    id: 2,
    title: 'Khảo sát trải nghiệm người dùng',
    eventId: null,
    eventName: 'Tổng quát',
    status: 'draft',
    createdAt: '2024-03-15T14:30:00Z',
    endDate: '2024-04-15T23:59:59Z',
    totalResponses: 0,
    targetResponses: 500,
    questions: [
      { id: 1, type: 'rating', question: 'Đánh giá giao diện ứng dụng', required: true },
      { id: 2, type: 'multiple_choice', question: 'Tính năng nào bạn sử dụng nhiều nhất?', required: true },
      { id: 3, type: 'text', question: 'Tính năng nào bạn muốn được thêm vào?', required: false }
    ],
    results: null
  }
];

export default function SurveyManagement() {
  const [surveys, setSurveys] = useState(mockSurveysData);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    eventId: '',
    endDate: '',
    targetResponses: 100,
    questions: []
  });

  // Fetch surveys from backend
  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await analyticsService.getSurveys();
        // setSurveys(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleCreateSurvey = async () => {
    try {
      // TODO: Call backend API to create survey
      // const response = await analyticsService.createSurvey(newSurvey);
      
      // Mock creation
      const createdSurvey = {
        ...newSurvey,
        id: surveys.length + 1,
        status: 'draft',
        createdAt: new Date().toISOString(),
        totalResponses: 0,
        results: null
      };
      
      setSurveys([...surveys, createdSurvey]);
      setNewSurvey({
        title: '',
        eventId: '',
        endDate: '',
        targetResponses: 100,
        questions: []
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating survey:', error);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: newSurvey.questions.length + 1,
      type: 'rating',
      question: '',
      required: true
    };
    setNewSurvey({
      ...newSurvey,
      questions: [...newSurvey.questions, newQuestion]
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newSurvey.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setNewSurvey({ ...newSurvey, questions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = newSurvey.questions.filter((_, i) => i !== index);
    setNewSurvey({ ...newSurvey, questions: updatedQuestions });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '🟢 Đang hoạt động';
      case 'draft': return '📝 Nháp';
      case 'completed': return '✅ Hoàn thành';
      case 'closed': return '🔒 Đã đóng';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-4 text-gray-600">Đang tải danh sách khảo sát...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
            <p className="mt-2 text-gray-600">
              Tạo và quản lý khảo sát để thu thập phản hồi từ người tham gia.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            ➕ Tạo khảo sát mới
          </button>
        </div>
      </div>

      {/* Survey Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-900">{surveys.length}</div>
          <div className="text-sm text-gray-500">Tổng số khảo sát</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-green-600">
            {surveys.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-500">Đang hoạt động</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">
            {surveys.reduce((sum, s) => sum + s.totalResponses, 0)}
          </div>
          <div className="text-sm text-gray-500">Tổng phản hồi</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">
            {surveys.filter(s => s.results).length > 0 
              ? (surveys.filter(s => s.results).reduce((sum, s) => sum + s.results.averageRating, 0) / 
                 surveys.filter(s => s.results).length).toFixed(1)
              : 0
            }
          </div>
          <div className="text-sm text-gray-500">Đánh giá TB</div>
        </div>
      </div>

      {/* Surveys List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Danh sách khảo sát</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {surveys.map((survey) => (
            <div key={survey.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-medium text-gray-900">{survey.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(survey.status)}`}>
                      {getStatusText(survey.status)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span>Sự kiện: {survey.eventName}</span>
                    <span className="mx-2">•</span>
                    <span>Tạo: {new Date(survey.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="mx-2">•</span>
                    <span>{survey.questions.length} câu hỏi</span>
                  </div>
                  
                  {survey.status === 'active' && (
                    <div className="mt-3">
                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="font-medium">{survey.totalResponses}</span>
                          <span className="text-gray-500">/{survey.targetResponses} phản hồi</span>
                        </div>
                        <div className="flex-1 max-w-xs">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${(survey.totalResponses / survey.targetResponses) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-indigo-600 font-medium">
                          {Math.round((survey.totalResponses / survey.targetResponses) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {survey.results && (
                    <button
                      onClick={() => setSelectedSurvey(survey)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      📊 Xem kết quả
                    </button>
                  )}
                  <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
                    ✏️ Chỉnh sửa
                  </button>
                  {survey.status === 'active' && (
                    <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                      🔗 Chia sẻ
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Survey Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowCreateModal(false)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tạo khảo sát mới</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề khảo sát</label>
                    <input
                      type="text"
                      value={newSurvey.title}
                      onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nhập tiêu đề khảo sát..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sự kiện</label>
                      <select
                        value={newSurvey.eventId}
                        onChange={(e) => setNewSurvey({ ...newSurvey, eventId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Tổng quát</option>
                        <option value="1">Tech Conference 2024</option>
                        <option value="2">Music Festival</option>
                        <option value="3">Business Summit</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu phản hồi</label>
                      <input
                        type="number"
                        value={newSurvey.targetResponses}
                        onChange={(e) => setNewSurvey({ ...newSurvey, targetResponses: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                    <input
                      type="date"
                      value={newSurvey.endDate}
                      onChange={(e) => setNewSurvey({ ...newSurvey, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  {/* Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Câu hỏi</label>
                      <button
                        onClick={addQuestion}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                      >
                        ➕ Thêm câu hỏi
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {newSurvey.questions.map((question, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Câu hỏi {index + 1}</span>
                            <button
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                                placeholder="Nhập câu hỏi..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              />
                            </div>
                            
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="rating">Đánh giá</option>
                              <option value="multiple_choice">Trắc nghiệm</option>
                              <option value="text">Văn bản</option>
                            </select>
                          </div>
                          
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                                className="form-checkbox h-4 w-4 text-indigo-600"
                              />
                              <span className="ml-2 text-sm text-gray-700">Bắt buộc</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleCreateSurvey}
                  disabled={!newSurvey.title || newSurvey.questions.length === 0}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tạo khảo sát
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Survey Results Modal */}
      {selectedSurvey && selectedSurvey.results && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setSelectedSurvey(null)}></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Kết quả khảo sát: {selectedSurvey.title}</h3>
                  <button
                    onClick={() => setSelectedSurvey(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedSurvey.results.averageRating}/5</div>
                    <div className="text-sm text-gray-500">Đánh giá trung bình</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedSurvey.results.responseRate}%</div>
                    <div className="text-sm text-gray-500">Tỷ lệ phản hồi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedSurvey.results.satisfaction}%</div>
                    <div className="text-sm text-gray-500">Độ hài lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedSurvey.results.nps}</div>
                    <div className="text-sm text-gray-500">NPS Score</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Chi tiết kết quả</h4>
                  <div className="text-sm text-gray-600">
                    <p>• Tổng số phản hồi: {selectedSurvey.totalResponses}</p>
                    <p>• Thời gian khảo sát: {new Date(selectedSurvey.createdAt).toLocaleDateString('vi-VN')} - {new Date(selectedSurvey.endDate).toLocaleDateString('vi-VN')}</p>
                    <p>• Sự kiện: {selectedSurvey.eventName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

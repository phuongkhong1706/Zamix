import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, Eye, FileText, TrendingUp, Users, Calendar, Download, CheckCircle, XCircle, Clock, Award, AlertTriangle, ArrowLeft } from 'lucide-react';
import '../../../../../styles/teacher/TeacherScoreExam.css';

const TeacherScoreExam = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForReviews, setSelectedExamForReviews] = useState(null);
  const [activeTab, setActiveTab] = useState('exams');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch('http://127.0.0.1:8000/api/teacher/teacher_result/teacher_score/');
        if (!resp.ok) {
          throw new Error(`Error fetching score data: ${resp.statusText}`);
        }
        const data = await resp.json();
        setExams(data.exams || []);
        setResults(data.results || []);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  // Filter functions
  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === 'all' || String(exam.grade) === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const filteredResults = results.filter(
    result => selectedExam ? result.exam_id === selectedExam.exam_id : false
  );

  const getReviewsForExam = (examId) => {
    return reviews.filter(
      review => review.exam_id === examId && review.status === 'pending'
    );
  };
  const totalPendingReviews = reviews.filter(review => review.status === 'pending').length;

  const getExamStatistics = (examId) => {
    const examResults = results.filter(r => r.exam_id === examId);
    const scores = examResults.map(r => r.total_score);
    if (scores.length === 0) return null;

    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const excellent = scores.filter(s => s >= 8).length;
    const good = scores.filter(s => s >= 6.5 && s < 8).length;
    const average = scores.filter(s => s >= 5 && s < 6.5).length;
    const poor = scores.filter(s => s < 5).length;
    const topStudent = examResults.find(r => r.total_score === max);
    const bottomStudent = examResults.find(r => r.total_score === min);

    return {
      avg, max, min, excellent, good, average, poor, total: scores.length,
      topStudent, bottomStudent
    };
  };

  const handleReviewAction = (reviewIndex, action) => {
    const updatedReviews = [...reviews];
    const reviewList = selectedExamForReviews ? getReviewsForExam(selectedExamForReviews.exam_id) : reviews;
    const reviewToUpdate = reviewList[reviewIndex];

    const globalIndex = reviews.findIndex(
      r => r.test_id === reviewToUpdate.test_id &&
           r.student_id === reviewToUpdate.student_id &&
           r.exam_id === reviewToUpdate.exam_id
    );

    if (globalIndex !== -1) {
      updatedReviews[globalIndex].status = action;
      setReviews(updatedReviews);
    }
  };

  const handleReviewExam = () => {
    navigate("/teacher/result/score/review_exam");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getScoreColor = (score) => {
    if (score >= 8) return 'teagrade-score-excellent';
    if (score >= 6.5) return 'teagrade-score-good';
    if (score >= 5) return 'teagrade-score-average';
    return 'teagrade-score-poor';
  };


  return (
    <div className="teagrade-container">
      {/* Header */}
      <div className="teagrade-header">
        <div className="teagrade-header-content">
          <div className="teagrade-header-info">
            <div>
              <h1 className="teagrade-title">Quản lý Điểm Thi</h1>
              <p className="teagrade-subtitle">Xem kết quả và xử lý phúc tra</p>
            </div>
            <div className="teagrade-header-actions">
              <div className="teagrade-pending-count">
                <span className="teagrade-pending-text">
                  {totalPendingReviews} đơn phúc tra chờ xử lý
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="teagrade-main-content">
        {/* Navigation Tabs */}
        <div className="teagrade-tabs">
          <div className="teagrade-tab-nav">
            <nav className="teagrade-tab-list">
              <button
                onClick={() => {
                  setActiveTab('exams');
                  setSelectedExamForReviews(null);
                }}
                className={`teagrade-tab ${activeTab === 'exams' ? 'teagrade-tab-active' : ''}`}
              >
                <div className="teagrade-tab-content">
                  <Calendar className="teagrade-tab-icon" />
                  Danh sách kỳ thi
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('reviews');
                  setSelectedExamForReviews(null);
                }}
                className={`teagrade-tab ${activeTab === 'reviews' ? 'teagrade-tab-active' : ''}`}
              >
                <div className="teagrade-tab-content">
                  <FileText className="teagrade-tab-icon" />
                  Đơn phúc tra ({totalPendingReviews})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div>
            {/* Filters */}
            <div className="teagrade-filters">
              <div className="teagrade-filter-group">
                <div className="teagrade-search-container">
                  <div className="teagrade-search-wrapper">
                    <Search className="teagrade-search-icon" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm kỳ thi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="teagrade-search-input"
                    />
                  </div>
                </div>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="teagrade-select"
                >
                  <option value="all">Tất cả lớp</option>
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>
            </div>

            {/* Exams List */}
            <div className="teagrade-exam-grid">
              {filteredExams.map((exam) => {
                const stats = getExamStatistics(exam.exam_id);
                return (
                  <div key={exam.exam_id} className="teagrade-exam-card">
                    <div className="teagrade-exam-card-content">
                      <div className="teagrade-exam-header">
                        <div>
                          <h3 className="teagrade-exam-title">{exam.name}</h3>
                          <p className="teagrade-exam-info">Lớp {exam.grade} • {exam.type}</p>
                        </div>
                      </div>
                      
                      <div className="teagrade-exam-details">
                        <div className="teagrade-exam-detail">
                          <Calendar className="teagrade-detail-icon" />
                          {formatDate(exam.start_time)}
                        </div>
                        <div className="teagrade-exam-detail">
                          <Users className="teagrade-detail-icon" />
                          {exam.completed_students}/{exam.total_students} học sinh
                        </div>
                        <div className="teagrade-exam-detail">
                          <TrendingUp className="teagrade-detail-icon" />
                          Điểm TB: {exam.avg_score}/10
                        </div>
                      </div>

                      {stats && (
                        <div className="teagrade-stats">
                          <div className="teagrade-stats-grid">
                            <div className="teagrade-stat-item teagrade-stat-excellent">
                              <div className="teagrade-stat-value">{stats.excellent}</div>
                              <div className="teagrade-stat-label">Giỏi (≥8)</div>
                            </div>
                            <div className="teagrade-stat-item teagrade-stat-good">
                              <div className="teagrade-stat-value">{stats.good}</div>
                              <div className="teagrade-stat-label">Khá (6.5-8)</div>
                            </div>
                            <div className="teagrade-stat-item teagrade-stat-average">
                              <div className="teagrade-stat-value">{stats.average}</div>
                              <div className="teagrade-stat-label">TB (5-6.5)</div>
                            </div>
                            <div className="teagrade-stat-item teagrade-stat-poor">
                              <div className="teagrade-stat-value">{stats.poor}</div>
                              <div className="teagrade-stat-label">Yếu (0-5)</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedExam(exam)}
                        className="teagrade-view-details-btn"
                      >
                        <Eye className="teagrade-btn-icon" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Results Modal */}
            {selectedExam && (
              <div className="teagrade-modal-overlay">
                <div className="teagrade-modal">
                  <div className="teagrade-modal-header">
                    <div>
                      <h2 className="teagrade-modal-title">{selectedExam.name}</h2>
                      <p className="teagrade-modal-subtitle">Chi tiết kết quả thi</p>
                    </div>
                    <div className="teagrade-modal-actions">
                      <button className="teagrade-export-btn">
                        <Download className="teagrade-btn-icon" />
                        Xuất Excel
                      </button>
                      <button
                        onClick={() => setSelectedExam(null)}
                        className="teagrade-close-btn"
                      >
                        <XCircle className="teagrade-close-icon" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="teagrade-modal-body">
                    {/* Top/Bottom Students Info */}
                    {(() => {
                      const stats = getExamStatistics(selectedExam.exam_id);
                      if (stats && stats.topStudent && stats.bottomStudent) {
                        return (
                          <div className="teagrade-top-bottom-students">
                            <div className="teagrade-top-student">
                              <div className="teagrade-student-highlight">
                                <Award className="teagrade-award-icon teagrade-top-icon" />
                                <div className="teagrade-student-info">
                                  <h4 className="teagrade-student-title">Điểm cao nhất</h4>
                                  <p className="teagrade-student-name">{stats.topStudent.student_name}</p>
                                  <p className="teagrade-student-details">
                                    {stats.topStudent.student_code} • 
                                    <span className={`teagrade-score ${getScoreColor(stats.topStudent.total_score)}`}>
                                      {stats.topStudent.total_score}/10
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="teagrade-bottom-student">
                              <div className="teagrade-student-highlight">
                                <AlertTriangle className="teagrade-alert-icon teagrade-bottom-icon" />
                                <div className="teagrade-student-info">
                                  <h4 className="teagrade-student-title">Điểm thấp nhất</h4>
                                  <p className="teagrade-student-name">{stats.bottomStudent.student_name}</p>
                                  <p className="teagrade-student-details">
                                    {stats.bottomStudent.student_code} • 
                                    <span className={`teagrade-score ${getScoreColor(stats.bottomStudent.total_score)}`}>
                                      {stats.bottomStudent.total_score}/10
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    <div className="teagrade-table-container">
                      <table className="teagrade-table">
                        <thead className="teagrade-table-header">
                          <tr>
                            <th className="teagrade-table-th">Học sinh</th>
                            <th className="teagrade-table-th">Mã HS</th>
                            <th className="teagrade-table-th">Điểm</th>
                            <th className="teagrade-table-th">Thời gian làm bài</th>
                          </tr>
                        </thead>
                        <tbody className="teagrade-table-body">
                          {filteredResults.map((result) => (
                            <tr key={result.result_id} className="teagrade-table-row">
                              <td className="teagrade-table-cell">
                                <div className="teagrade-student-name">{result.student_name}</div>
                              </td>
                              <td className="teagrade-table-cell">
                                <div className="teagrade-student-code">{result.student_code}</div>
                              </td>
                              <td className="teagrade-table-cell">
                                <span className={`teagrade-score ${getScoreColor(result.total_score)}`}>
                                  {result.total_score}/10
                                </span>
                              </td>
                              <td className="teagrade-table-cell teagrade-duration">
                                {Math.round((new Date(result.end_time) - new Date(result.start_time)) / 60000)} phút
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            {!selectedExamForReviews ? (
              // Danh sách kỳ thi với thống kê phúc tra
              <div className="teagrade-reviews-container">
                <div className="teagrade-reviews-header">
                  <h2 className="teagrade-reviews-title">Danh sách kỳ thi có đơn phúc tra</h2>
                  <p className="teagrade-reviews-subtitle">Chọn kỳ thi để xem các đơn phúc tra</p>
                </div>
                
                <div className="teagrade-exam-reviews-grid">
                  {exams.map((exam) => {
                    const examReviews = getReviewsForExam(exam.exam_id);
                    if (examReviews.length === 0) return null;
                    
                    return (
                      <div key={exam.exam_id} className="teagrade-exam-review-card">
                        <div className="teagrade-exam-card-content">
                          <div className="teagrade-exam-header">
                            <div>
                              <h3 className="teagrade-exam-title">{exam.name}</h3>
                              <p className="teagrade-exam-info">Lớp {exam.grade} • {exam.type}</p>
                            </div>
                            <div className="teagrade-review-count-badge">
                              {examReviews.length} đơn
                            </div>
                          </div>
                          
                          <div className="teagrade-exam-details">
                            <div className="teagrade-exam-detail">
                              <Calendar className="teagrade-detail-icon" />
                              {formatDate(exam.start_time)}
                            </div>
                            <div className="teagrade-exam-detail">
                              <FileText className="teagrade-detail-icon" />
                              {examReviews.length} đơn phúc tra chờ xử lý
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedExamForReviews(exam)}
                            className="teagrade-view-details-btn"
                          >
                            <Eye className="teagrade-btn-icon" />
                            Xem đơn phúc tra
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {exams.every(exam => getReviewsForExam(exam.exam_id).length === 0) && (
                  <div className="teagrade-empty-state">
                    <FileText className="teagrade-empty-icon" />
                    <h3 className="teagrade-empty-title">Không có đơn phúc tra nào</h3>
                    <p className="teagrade-empty-text">Hiện tại không có đơn phúc tra nào cần xử lý.</p>
                  </div>
                )}
              </div>
            ) : (
              // Danh sách phúc tra của kỳ thi được chọn
              <div className="teagrade-reviews-container">
                <div className="teagrade-reviews-header">
                  <button
                    onClick={() => setSelectedExamForReviews(null)}
                    className="teagrade-back-btn"
                  >
                    <ArrowLeft className="teagrade-back-icon" />
                    Quay lại
                  </button>
                  <div>
                    <h2 className="teagrade-reviews-title">{selectedExamForReviews.name}</h2>
                    <p className="teagrade-reviews-subtitle">
                      Đơn phúc tra chờ xử lý ({getReviewsForExam(selectedExamForReviews.exam_id).length})
                    </p>
                  </div>
                </div>
                
                <div className="teagrade-reviews-list">
                  {getReviewsForExam(selectedExamForReviews.exam_id).map((review, index) => (
                    <div key={`${review.test_id}-${review.student_id}`} className="teagrade-review-item">
                      <div className="teagrade-review-content">
                        <div className="teagrade-review-student-info">
                          <h3 className="teagrade-review-student-name">{review.student_name}</h3>
                          <span className="teagrade-review-student-code">({review.student_code})</span>
                          <span className={`teagrade-score ${getScoreColor(review.score)}`}>
                            Điểm hiện tại: {review.score}/10
                          </span>
                        </div>
                        
                        <div className="teagrade-review-time">
                          <Clock className="teagrade-time-icon" />
                          Gửi lúc: {formatDate(review.created_at)}
                        </div>
                        
                        <div className="teagrade-review-reason">
                          <h4 className="teagrade-reason-title">Lý do phúc tra:</h4>
                          <p className="teagrade-reason-text">{review.reason}</p>
                        </div>
                        
                        <div className="teagrade-review-actions">
                          <button
                            onClick={() => handleReviewAction(index, 'approved')}
                            className="teagrade-action-btn teagrade-approve-btn"
                          >
                            <CheckCircle className="teagrade-btn-icon" />
                            Chấp nhận
                          </button>
                          <button
                            onClick={() => handleReviewAction(index, 'rejected')}
                            className="teagrade-action-btn teagrade-reject-btn"
                          >
                            <XCircle className="teagrade-btn-icon" />
                            Từ chối
                          </button>
                          <button
                            onClick={handleReviewExam} 
                            className="teagrade-action-btn teagrade-view-btn">
                            Xem bài làm
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherScoreExam;
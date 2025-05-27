// ExamDetailModal.jsx
import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  h3 {
    margin-top: 0;
  }

  .close-btn {
    margin-top: 16px;
    background-color: #007bff;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
`;

export default function ExamDetailModal({ exam, onClose }) {
  if (!exam) return null;

  return (
    <Overlay>
      <ModalBox>
        <h3>Chi tiết kỳ thi</h3>
        <p><strong>Tên:</strong> {exam.name}</p>
        <p><strong>Lớp:</strong> {exam.grade_display}</p>
        <p><strong>Trạng thái:</strong> {exam.status_display}</p>
        <p><strong>Loại:</strong> {exam.type}</p>
        <p><strong>Thời gian bắt đầu:</strong> {new Date(exam.time_start).toLocaleString()}</p>
        <p><strong>Thời gian kết thúc:</strong> {new Date(exam.time_end).toLocaleString()}</p>
        <button className="close-btn" onClick={onClose}>Đóng</button>
      </ModalBox>
    </Overlay>
  );
}

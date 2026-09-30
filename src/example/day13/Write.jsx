import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/board';

export default function Write() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  // async / await 기반 폼 등록
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(`${API_BASE}/write`, formData);
      if (response.data === true) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/');
      } else {
        alert('등록 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('등록 요청 오류:', error);
    }
  };

  return (
    <div>
      <h3>게시글 작성</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          required
          style={{ padding: '8px', fontSize: '14px' }}
        />
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px' }}>첨부파일 (이미지 등):</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>저장</button>
          <button type="button" onClick={() => navigate('/')} style={{ padding: '8px 16px', cursor: 'pointer' }}>취소</button>
        </div>
      </form>
    </div>
  );
}
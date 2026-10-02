import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/board';

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);

  // async / await 기반 상세 단건 조회
  const fetchBoard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/view?id=${id}`);
      setBoard(response.data);
    } catch (error) {
      console.error('상세조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  if (!board) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  // 확장자 기준 이미지 여부 판단
  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  // 원본 파일명 추출
  const originalName = board.fileName && board.fileName.includes('_')
    ? board.fileName.substring(board.fileName.indexOf('_') + 1)
    : board.fileName;

  // 스트리밍/다운로드 API 엔드포인트 URL
  const fileUrl = `${API_BASE}/download/${id}`;

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
      <h3>{board.title}</h3>
      <div style={{ color: '#666', fontSize: '13px', marginBottom: '15px' }}>
        작성일: {board.cdate ? board.cdate.replace('T', ' ') : '-'}
      </div>

      <div style={{ minHeight: '120px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
        {board.content}
      </div>

      {/* 첨부파일 영역 */}
      {board.fileName && (
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px dashed #ccc' }}>
          <h4>첨부 이미지 미리보기</h4>
          {isImageFile(board.fileName) ? (
            <div style={{ marginBottom: '15px' }}>
              <img
                src={fileUrl}
                alt="첨부 이미지"
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #eee' }}
              />
            </div>
          ) : (
            <p style={{ color: '#888', fontSize: '13px' }}>이미지 파일이 아닙니다.</p>
          )}

          <div>
            <strong>파일 다운로드: </strong>
            <button
              onClick={() => { window.location.href = fileUrl; }}
              style={{ cursor: 'pointer', padding: '4px 8px' }}
            >
              {originalName} 다운로드
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}
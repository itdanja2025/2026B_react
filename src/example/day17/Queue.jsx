import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Axios 인스턴스 설정 (Vite 기본 포트 기준 CORS 연결)
const api = axios.create({
  baseURL: 'http://localhost:8080/api/queue',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function App() {
  const [task, setTask] = useState(null);
  const [statusInfo, setStatusInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 대기열 등록 요청
  const handleRequest = async () => {
    setLoading(true);
    try {
      const response = await api.post('/enter');
      // axios는 JSON 파싱을 자동으로 수행하여 response.data에 담습니다.
      setTask(response.data);
    } catch (err) {
      console.error('대기열 진입 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 대기 순번 및 작업 진행 상태 폴링 (1초 간격)
  useEffect(() => {
    if (!task || statusInfo?.status === 'COMPLETED') return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/status/${task.taskId}`);
        const data = response.data;
        setStatusInfo(data);

        if (data.status === 'COMPLETED') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('상태 조회 실패:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task, statusInfo?.status]);

  const handleReset = () => {
    setTask(null);
    setStatusInfo(null);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '60px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>순차 대기열 처리 시스템</h2>

      {!task && (
        <button
          onClick={handleRequest}
          disabled={loading}
          style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? '대기열 등록 중...' : '1분 작업 요청하기'}
        </button>
      )}

      {statusInfo && (
        <div style={{ marginTop: '30px', padding: '24px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>발급 대기 번호: {statusInfo.queueNumber}번</h3>

          {statusInfo.status === 'WAITING' && (
            <div>
              <p style={{ color: '#d97706', fontWeight: 'bold' }}>⏳ 대기 중입니다</p>
              <p>내 앞 대기자 수: <strong>{statusInfo.aheadCount}명</strong></p>
              <p style={{ fontSize: '13px', color: '#666' }}>앞선 작업이 종료되면 자동으로 내 작업이 시작됩니다.</p>
            </div>
          )}

          {statusInfo.status === 'PROCESSING' && (
            <div>
              <p style={{ color: '#2563eb', fontWeight: 'bold' }}>⚙️ 내 차례가 되어 처리 중입니다</p>
              <p style={{ fontSize: '13px', color: '#666' }}>약 30초 간 작업이 진행됩니다. 창을 닫지 마세요.</p>
            </div>
          )}

          {statusInfo.status === 'COMPLETED' && (
            <div>
              <p style={{ color: '#16a34a', fontWeight: 'bold' }}>✅ 작업이 완료되었습니다!</p>
              <button
                onClick={handleReset}
                style={{ marginTop: '15px', padding: '8px 16px', cursor: 'pointer' }}
              >
                새로운 요청하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
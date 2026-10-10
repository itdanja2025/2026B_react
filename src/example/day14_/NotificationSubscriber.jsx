import React, { useState, useEffect } from 'react';

const NotificationSubscriber = ({ initialUserId }) => {
  // 1. props가 없으면 난수 기반 userId를 최초 1회만 생성하여 고정 (리렌더링 시 변경 방지)
  const [userId] = useState(
    () => initialUserId || `user_${Math.floor(Math.random() * 9000) + 1000}`
  );

  const [toasts, setToasts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('연결 중...');

  // 토스트 수동 제거 함수
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    // 2. 브라우저 내장 EventSource 객체 생성
    const eventSource = new EventSource(
      `http://localhost:8080/api/notifications/subscribe/${userId}`
    );

    eventSource.onopen = () => {
      console.log(`SSE 연결 수립됨: ${userId}`);
      setConnectionStatus('연결됨');
    };

    // 초기 연결 확인 이벤트
    eventSource.addEventListener('CONNECT', (e) => {
      console.log('초기 연결 확인:', e.data);
    });

    // 3. 서버 커스텀 이벤트(alarm) 수신 처리
    eventSource.addEventListener('alarm', (e) => {
      let content = e.data;
      try {
        content = JSON.parse(e.data);
      } catch (err) {
        content = { message: e.data };
      }

      const id = Date.now() + Math.random();
      const newToast = {
        id,
        title: content.title || '새 알림',
        message: content.message || (typeof content === 'string' ? content : JSON.stringify(content)),
        time: new Date().toLocaleTimeString(),
      };

      // 새 알림을 스택 상단에 추가 (수동 닫기 유지)
      setToasts((prev) => [newToast, ...prev]);
    });

    eventSource.onerror = (err) => {
      console.error('SSE 에러 발생:', err);
      setConnectionStatus('연결 끊김 (재시도 중)');
    };

    return () => {
      console.log(`SSE 연결 종료: ${userId}`);
      eventSource.close();
    };
  }, [userId]);

  return (
    <>
      {/* 1. 상단 상태 표시 영역 (생성된 난수 userId 확인 가능) */}
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h2>SSE 실시간 알림 서비스</h2>
        <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '6px', display: 'inline-block' }}>
          <p style={{ margin: '0 0 6px 0' }}>
            <strong>내 고유 ID:</strong> <code style={{ color: '#1976d2', fontSize: '15px' }}>{userId}</code>
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: connectionStatus === '연결됨' ? '#2e7d32' : '#d32f2f' }}>
            ● 상태: {connectionStatus}
          </p>
        </div>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
          * 터미널에서 위 고유 ID를 타깃으로 알림 POST 요청을 전송해 보세요.
        </p>
      </div>

      {/* 2. 우측 하단 고정 팝업 컨테이너 (Toast Stack) */}
      <div
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 9999,
          maxWidth: '360px',
          width: '100%',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          pointerEvents: 'none',
          paddingRight: '4px',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              borderLeft: '5px solid #1976d2',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: 'sans-serif',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            {/* 상단 타이틀 & 닫기 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '15px', color: '#1a1a1a' }}>
                🔔 {toast.title}
              </strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>{toast.time}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#999',
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="닫기"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* 알림 본문 내용 */}
            <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.4, wordBreak: 'break-word' }}>
              {toast.message}
            </div>
          </div>
        ))}
      </div>

      {/* 부드러운 등장 애니메이션 스타일 */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default NotificationSubscriber;
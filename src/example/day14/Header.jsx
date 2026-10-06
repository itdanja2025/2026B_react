import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header = ({ userId }) => {
  const [toasts, setToasts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('연결 중...');

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (!userId) return;

    // 공통 userId를 기반으로 전역 SSE 알림 구독
    const eventSource = new EventSource(
      `http://localhost:8080/api/notifications/subscribe/${userId}`
    );

    eventSource.onopen = () => {
      console.log(`[전역 SSE] 연결 완료: ${userId}`);
      setConnectionStatus('연결됨');
    };

    eventSource.addEventListener('CONNECT', (e) => {
      console.log('초기 연결 확인:', e.data);
    });

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

      setToasts((prev) => [newToast, ...prev]);
    });

    eventSource.onerror = (err) => {
      console.error('[전역 SSE] 에러:', err);
      setConnectionStatus('연결 끊김 (재시도 중)');
    };

    return () => {
      console.log(`[전역 SSE] 연결 종료: ${userId}`);
      eventSource.close();
    };
  }, [userId]);

  return (
    <>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: '#263238',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <strong style={{ fontSize: '18px' }}>Realtime Hub</strong>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? '#90caf9' : '#eceff1',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              메인 (홈)
            </NavLink>
            <NavLink
              to="/chat"
              style={({ isActive }) => ({
                color: isActive ? '#90caf9' : '#eceff1',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
              })}
            >
              채팅방
            </NavLink>
          </nav>
        </div>

        {/* 상단에 표시되는 내 고유 ID 및 SSE 상태 */}
        <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>내 ID: <code style={{ color: '#81d4fa', fontWeight: 'bold' }}>{userId}</code></span>
          <span style={{ color: connectionStatus === '연결됨' ? '#69f0ae' : '#ffab91' }}>
            ● {connectionStatus}
          </span>
        </div>
      </header>

      {/* 우측 하단 고정 알림 팝업 영역 */}
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
            <div style={{ fontSize: '13px', color: '#444', lineHeight: 1.4, wordBreak: 'break-word' }}>
              {toast.message}
            </div>
          </div>
        ))}
      </div>

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

export default Header;
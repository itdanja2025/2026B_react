import React from 'react';

const Home = ({ userId }) => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h2>실시간 알림 및 채팅 플랫폼</h2>
      <p style={{ color: '#555', lineHeight: 1.6 }}>
        현재 로그인된 내 고유 식별자는 <strong>{userId}</strong> 입니다.
        상단 네비게이션에서 <strong>채팅방</strong>으로 이동해도 동일한 아이디로 참여하며, 
        페이지 이동 중에도 알림 팝업은 상시 수신됩니다.
      </p>

      <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px', marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>💡 특정 사용자 / 전체 발송 테스트 (cURL)</h4>
        
        <p style={{ fontSize: '13px', margin: '10px 0 4px 0', color: '#333' }}>
          <strong>1) 나에게만 개인 알림 발송:</strong>
        </p>
        <pre style={{ backgroundColor: '#263238', color: '#eceff1', padding: '10px', borderRadius: '4px', fontSize: '12px', overflowX: 'auto' }}>

        </pre>

        <p style={{ fontSize: '13px', margin: '14px 0 4px 0', color: '#333' }}>
          <strong>2) 모든 접속자에게 전체 브로드캐스트 발송:</strong>
        </p>
        <pre style={{ backgroundColor: '#263238', color: '#eceff1', padding: '10px', borderRadius: '4px', fontSize: '12px', overflowX: 'auto' }}>

        </pre>
      </div>
    </div>
  );
};

export default Home;
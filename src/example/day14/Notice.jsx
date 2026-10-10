import { useState, useEffect } from 'react';

export default function Notice() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    // SSE 구독
    const eventSource = new EventSource('http://localhost:8080/api/sse/subscribe');

    // 서버의 notification 이벤트 수신
    eventSource.addEventListener('notice', (e) => {
      const newNotice = {
        id: Math.random(),
        text: e.data,
      };

      // 새 알림 추가
      notices.push( newNotice )
      setNotices([...notices]);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  // 개별 알림 닫기
    const removeNotice = (id) => {
      setNotices(notices.filter((item) => item.id !== id));
    };

  return (
    <div>
      {notices.map((item) => (
        <div>
          <p>{item.text}</p>
          <button type="button" onClick={() => removeNotice(item.id)}> X </button>
        </div>
      ))}
    </div>
  );
}
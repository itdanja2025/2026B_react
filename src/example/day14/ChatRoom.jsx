import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const ChatRoom = ({ initialRoomId = 'general', userId }) => {
  // 방 번호 관리
  const [currentRoom, setCurrentRoom] = useState(initialRoomId);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 메시지 업데이트 시 스크롤 최하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;
    setMessages([]);

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-chat',
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        if (!isMounted) {
          client.deactivate();
          return;
        }

        setIsConnected(true);
        console.log(`STOMP 연결 성공: [방 ${currentRoom}] - 사용자: ${userId}`);

        // 해당 방 구독 (/sub/chat/room/{currentRoom})
        client.subscribe(`/sub/chat/room/${currentRoom}`, (message) => {
          if (!isMounted) return;
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });

        // 입장 메시지 발행 (/pub/chat/message)
        client.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({
            type: 'ENTER',
            roomId: currentRoom,
            sender: userId,
            content: '',
          }),
        });
      },

      onDisconnect: () => {
        if (isMounted) {
          setIsConnected(false);
          console.log('STOMP 연결 해제');
        }
      },

      onStompError: (frame) => {
        console.error('브로커 에러: ', frame.headers['message']);
        console.error('추가 정보: ', frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    // cleanup: 방 변경 또는 컴포넌트 언마운트 시 퇴장 메시지 발송 후 소켓 종료
    return () => {
      isMounted = false;

      if (client.connected) {
        try {
          client.publish({
            destination: '/pub/chat/message',
            body: JSON.stringify({
              type: 'LEAVE',
              roomId: currentRoom,
              sender: userId,
              content: `${userId}님이 퇴장하셨습니다.`,
            }),
          });
        } catch (err) {
          console.warn('퇴장 메시지 전송 생략:', err);
        }
      }

      client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [currentRoom, userId]);

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify({
        type: 'TALK',
        roomId: currentRoom,
        sender: userId,
        content: inputMessage,
      }),
    });

    setInputMessage('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
      {/* 헤더 영역: 닉네임 입력 폼 없이 방 선택 및 상태만 노출 */}
      <header
        style={{
          borderBottom: '1px solid #ddd',
          paddingBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>채팅방: {currentRoom}</h3>
          <p style={{ margin: 0, fontSize: '13px', color: isConnected ? 'green' : 'red' }}>
            ● {isConnected ? '연결됨' : '연결 중...'} (접속 닉네임: <strong>{userId}</strong>)
          </p>
        </div>

        <div>
          <label style={{ fontSize: '13px', marginRight: '6px' }}>방 선택:</label>
          <select
            value={currentRoom}
            onChange={(e) => setCurrentRoom(e.target.value)}
            style={{ padding: '5px 8px', borderRadius: '4px' }}
          >
            <option value="general">general</option>
            <option value="notice">notice</option>
            <option value="random">random</option>
          </select>
        </div>
      </header>

      {/* 메시지 리스트 영역 */}
      <div
        style={{
          height: '350px',
          overflowY: 'auto',
          border: '1px solid #eee',
          padding: '10px',
          margin: '15px 0',
          backgroundColor: '#fafafa',
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            {msg.type === 'ENTER' || msg.type === 'LEAVE' ? (
              <div style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>
                --- {msg.content} ---
              </div>
            ) : (
              <div>
                <strong>{msg.sender === userId ? '나' : msg.sender}:</strong> {msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 폼 영역 */}
      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          disabled={!isConnected}
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          disabled={!isConnected}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
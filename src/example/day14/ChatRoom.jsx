import { useState, useRef, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import './ChatRoom.css';
import Notice from './Notice';

export default function ChatRoom() {
  const [roomId, setRoomId] = useState('');
  const [sender, setSender] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null); // 최하단 스크롤 참조용 Ref

  // 메시지 배열(messages)이 변경될 때마다 최하단으로 스크롤 이동
  useEffect(() => {
    if( messagesEndRef.current != null ){
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 1. 방 접속 (ENTER)
  const connect = () => {
    if ( roomId == '' || sender == '') {
      alert('방 번호와 닉네임을 입력해주세요.');
      return;
    }

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-chat',
      onConnect: () => {
        setIsConnected(true);
        // 지정된 방 구독
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          messages.push( JSON.parse(message.body) ) ;
          setMessages([...messages]);
        });

        // 입장 메시지 발행
        client.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({ type: 'ENTER', roomId, sender, content: '' , date : new Date().toLocaleTimeString() }),
        });
      },
    });

    client.activate();
    clientRef.current = client;
  };

  // 2. 방 퇴장 (QUIT)
  const disconnect = () => {
    if (clientRef.current != null ) {
      // 퇴장 메시지 발행 후 연결 해제
      clientRef.current.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify({ type: 'QUIT', roomId, sender, content: '', date : new Date().toLocaleTimeString() }),
      });
      clientRef.current.deactivate();
    }
    setIsConnected(false);
    setMessages([]);
  };

  // 3. 메시지 전송 (TALK)
  const sendMessage = () => {
    if ( clientRef.current == null || message == '' ) return;

    clientRef.current.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify({ type: 'TALK', roomId, sender, content: message , date : new Date().toLocaleTimeString() }),
    });
    setMessage('');
  };

  return (
    <div>
      {/* 접속 전: 방 번호 / 닉네임 입력 */}
      {!isConnected ? (
        <div>
          <input
            placeholder="방 번호"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            placeholder="닉네임"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
          />
          <button type="button" onClick={connect}>접속</button>
        </div>
      ) : (
        /* 접속 후: 채팅방 및 메시지 송수신 */
        <div>
          <div>
            <b>[방 번호: {roomId} / 접속자: {sender}]</b>
            <button type="button" onClick={disconnect}>퇴장</button>
          </div>

          {/* 메시지 리스트 영역 */}
          <div>
            {messages.map((msg) => (
              <div >
                {msg.type === 'TALK' ? (
                  msg.sender === sender ? (
                    /* [내가 보낸 메시지] */
                    <div>
                      <time>{msg.date}</time>
                      <p>{msg.content}</p>
                    </div>
                  ) : (
                    /* [상대방이 보낸 메시지] */
                    <div>
                      <small>{msg.sender}</small>
                      <div>
                        <span>{msg.content}</span>
                        <time>{msg.date}</time>
                      </div>
                    </div>
                  )
                ) : (
                  /* [시스템 알림] */
                  <i>{msg.content}</i>
                )}
              </div>
            ))}
            {/* 스크롤 기준점 역할을 하는 최하단 빈 div */}
            <div ref={messagesEndRef} />
          </div>

          <div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} />
            <button type="button" onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
      {/* 분리된 오른쪽 하단 알림창 컴포넌트 */}
      <Notice />
    </div>
  );
}
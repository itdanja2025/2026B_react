// React 기본 훅(useState, useEffect, useRef) 임포트
import React, { useState, useEffect, useRef } from 'react';
// STOMP 프로토콜 통신을 지원하는 Client 객체 임포트 (라이브러리: npm i @stomp/stompjs)
import { Client } from '@stomp/stompjs'; // npm @stomp/stompjs

// 채팅방 메인 컴포넌트 선언
const ChatRoom = () => {
  // 수신된 채팅 메시지 객체들을 누적 저장하는 배열 상태
  const [messages, setMessages] = useState([]);
  // 사용자가 입력창에 작성 중인 메시지 텍스트 상태
  const [inputMessage, setInputMessage] = useState('');
  // 리렌더링과 관계없이 STOMP Client 인스턴스를 유지하기 위한 레퍼런스 객체
  const clientRef = useRef(null);

  // 컴포넌트 마운트 시 소켓 연결 및 구독을 초기화하는 이펙트 훅
  useEffect(() => {
    // STOMP 클라이언트 인스턴스 생성 및 통신 옵션 설정
    const client = new Client({
      // 백엔드 웹소켓 연결용 엔드포인트 URL
      brokerURL: 'ws://localhost:8080/ws-chat',
      // 웹소켓 핸드셰이크 및 STOMP 브로커 연결 성공 시 실행되는 콜백
      onConnect: () => {
        // 'general' 방 토픽 경로(/sub/chat/room/general) 구독 등록
        client.subscribe('/sub/chat/room/general', (message) => {
          // 수신된 JSON 형식의 메시지 본문(body)을 JS 객체로 파싱하여 배열에 직접 push
          messages.push( JSON.parse(message.body ) );
          // 배열의 얕은 복사본(새로운 참조값)을 만들어 상태를 업데이트하고 리렌더링 유발
          setMessages( [...messages] )
        });
      },
    });

    // 클라이언트 활성화 (실제 웹소켓 연결 시작)
    client.activate();
    // 컴포넌트 전역에서 클라이언트를 재참조할 수 있도록 ref에 저장
    clientRef.current = client;

    // 컴포넌트 언마운트 시 실행되는 클린업 함수
    return () => {
      // 페이지 이탈 또는 컴포넌트 제거 시 소켓 연결을 안전하게 해제
      client.deactivate();
    };
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때 단 1회만 실행

  // 메시지 전송 처리 이벤트 핸들러
  const handleSendMessage = (e) => {
    // 이벤트의 기본 동작 방지 (폼 태그나 이벤트 전파 차단 목적)
    e.preventDefault();
    // 클라이언트 인스턴스가 없거나 소켓이 연결되지 않은 상태라면 함수 종료
    if (!clientRef.current?.connected) return;

    // 브로커의 메시지 발행 경로(/pub/chat/message)로 데이터 전송
    clientRef.current.publish({
      destination: '/pub/chat/message',
      // 서버 규격(DTO)에 맞춰 대화 데이터를 JSON 문자열로 직렬화하여 본문에 설정
      body: JSON.stringify({
        type: 'TALK',          // 메시지 유형 (일반 대화)
        roomId: 'general',     // 대상 채팅방 식별자
        sender: 'user',        // 발신자 이름 또는 식별자
        content: inputMessage, // 전송할 메시지 내용
      }),
    });

    // 전송 완료 후 입력 필드를 빈 문자열로 초기화
    setInputMessage('');
  };

  // 컴포넌트 렌더링 영역
  return (
    <div>
      {/* 채팅 메시지 목록 컨테이너 */}
      <div>
        {/* 누적된 메시지 배열을 순회하며 발신자와 내용을 순서대로 렌더링 */}
        {messages.map((msg) => (
          <div>
            {/* 발신자 표시 */}
            <b>{msg.sender}:</b> {msg.content}
          </div>
        ))}
      </div>

      {/* 메시지 입력창 및 전송 버튼 컨테이너 */}
      <div >
        {/* 입력값과 inputMessage 상태를 양방향 바인딩한 인풋 요소 */}
        <input  value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
        {/* 클릭 시 handleSendMessage 함수를 호출하여 메시지를 전송하는 버튼 */}
        <button type="button" onClick={ handleSendMessage }>전송</button>
      </div>
    </div>
  );
};

export default ChatRoom;

// import React, { useState, useEffect, useRef } from 'react';
// import { Client } from '@stomp/stompjs';

// const ChatRoom = ({ initialRoomId = 'general', userId }) => {
//   // 방 번호 관리
//   const [currentRoom, setCurrentRoom] = useState(initialRoomId);

//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isConnected, setIsConnected] = useState(false);

//   const clientRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // 메시지 업데이트 시 스크롤 최하단 이동
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   useEffect(() => {
//     let isMounted = true;
//     setMessages([]);

//     const client = new Client({
//       brokerURL: 'ws://localhost:8080/ws-chat',
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,

//       onConnect: () => {
//         if (!isMounted) {
//           client.deactivate();
//           return;
//         }

//         setIsConnected(true);
//         console.log(`STOMP 연결 성공: [방 ${currentRoom}] - 사용자: ${userId}`);

//         // 해당 방 구독 (/sub/chat/room/{currentRoom})
//         client.subscribe(`/sub/chat/room/${currentRoom}`, (message) => {
//           if (!isMounted) return;
//           const receivedMessage = JSON.parse(message.body);
//           setMessages((prev) => [...prev, receivedMessage]);
//         });

//         // 입장 메시지 발행 (/pub/chat/message)
//         client.publish({
//           destination: '/pub/chat/message',
//           body: JSON.stringify({
//             type: 'ENTER',
//             roomId: currentRoom,
//             sender: userId,
//             content: '',
//           }),
//         });
//       },

//       onDisconnect: () => {
//         if (isMounted) {
//           setIsConnected(false);
//           console.log('STOMP 연결 해제');
//         }
//       },

//       onStompError: (frame) => {
//         console.error('브로커 에러: ', frame.headers['message']);
//         console.error('추가 정보: ', frame.body);
//       },
//     });

//     client.activate();
//     clientRef.current = client;

//     // cleanup: 방 변경 또는 컴포넌트 언마운트 시 퇴장 메시지 발송 후 소켓 종료
//     return () => {
//       isMounted = false;

//       if (client.connected) {
//         try {
//           client.publish({
//             destination: '/pub/chat/message',
//             body: JSON.stringify({
//               type: 'LEAVE',
//               roomId: currentRoom,
//               sender: userId,
//               content: `${userId}님이 퇴장하셨습니다.`,
//             }),
//           });
//         } catch (err) {
//           console.warn('퇴장 메시지 전송 생략:', err);
//         }
//       }

//       client.deactivate();
//       clientRef.current = null;
//       setIsConnected(false);
//     };
//   }, [currentRoom, userId]);

//   // 메시지 전송 핸들러
//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim() || !clientRef.current?.connected) return;

//     clientRef.current.publish({
//       destination: '/pub/chat/message',
//       body: JSON.stringify({
//         type: 'TALK',
//         roomId: currentRoom,
//         sender: userId,
//         content: inputMessage,
//       }),
//     });

//     setInputMessage('');
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
//       {/* 헤더 영역: 닉네임 입력 폼 없이 방 선택 및 상태만 노출 */}
//       <header
//         style={{
//           borderBottom: '1px solid #ddd',
//           paddingBottom: '12px',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <div>
//           <h3 style={{ margin: '0 0 4px 0' }}>채팅방: {currentRoom}</h3>
//           <p style={{ margin: 0, fontSize: '13px', color: isConnected ? 'green' : 'red' }}>
//             ● {isConnected ? '연결됨' : '연결 중...'} (접속 닉네임: <strong>{userId}</strong>)
//           </p>
//         </div>

//         <div>
//           <label style={{ fontSize: '13px', marginRight: '6px' }}>방 선택:</label>
//           <select
//             value={currentRoom}
//             onChange={(e) => setCurrentRoom(e.target.value)}
//             style={{ padding: '5px 8px', borderRadius: '4px' }}
//           >
//             <option value="general">general</option>
//             <option value="notice">notice</option>
//             <option value="random">random</option>
//           </select>
//         </div>
//       </header>

//       {/* 메시지 리스트 영역 */}
//       <div
//         style={{
//           height: '350px',
//           overflowY: 'auto',
//           border: '1px solid #eee',
//           padding: '10px',
//           margin: '15px 0',
//           backgroundColor: '#fafafa',
//         }}
//       >
//         {messages.map((msg, index) => (
//           <div key={index} style={{ marginBottom: '8px' }}>
//             {msg.type === 'ENTER' || msg.type === 'LEAVE' ? (
//               <div style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>
//                 --- {msg.content} ---
//               </div>
//             ) : (
//               <div>
//                 <strong>{msg.sender === userId ? '나' : msg.sender}:</strong> {msg.content}
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* 입력 폼 영역 */}
//       <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           placeholder="메시지를 입력하세요..."
//           disabled={!isConnected}
//           style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
//         />
//         <button
//           type="submit"
//           disabled={!isConnected}
//           style={{
//             padding: '8px 16px',
//             backgroundColor: '#1976d2',
//             color: '#fff',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer',
//           }}
//         >
//           전송
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatRoom;
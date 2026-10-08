import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react"
// ***** 웹소켓/STOMP 설치 ***** 1. 설치: npm install @stomp/stompjs
export default function ChatRoom( props ){
    // * useState 이란? 상태(값) 저장하고 *변경시 해당 컴포넌트/함수 재실행/재호출* 훅/라이브러리
    // const [ 변수명 , set변수명 ] = useState( 초기값 ); 
    const [ message , setMessage ] = useState(''); // 입력받은 메시지 
    const [ messages , setMessages ] = useState([]); // 메시지들 , 서버로부터 받은 메시지들
    // * useRef 이란? 상태(값) 저장하고 *다른 상태와 상관없이 새로고침/초기화 방지 => 상태 유지 *
    // const 변수명 = useRef( 초기값 ); , useRef변수는 .current 속성에 값 보관
    const clientRef = useRef( null ); // 지역변수vs상태(useState)변수vs참조(useRef)변수

    // *전송시 백엔드에게 메시지 보내기 
    const sendMessage = ( e ) => { 
        if( clientRef.current == null ) return;
        const info = {  // 스프링 MessageDto 참조하여 구성 
            type : 'TALK', roomId,  sender,
            content : message , date : new Date().toLocaleTimeString()
        } 
        clientRef.current.publish({ 
            destination : "/pub/chat/message"  , 
            body : JSON.stringify( info ) , // JSON.stringify( ) , JS객체->문자열 변환 함수
        })
    }

    const [ isConnected , setIsConnected] = useState( false ); // 방 접속 여부
    const [ roomId , setRoomId ] = useState(''); // 입력받은 방
    const [ sender , setSender ] = useState(''); // 접속자(닉네임)
    // 접속 함수 --> 스프링 브로커 연결 
    const connect = ()=>{
        const client = new Client( { 
            brokerURL : "ws://localhost:8080/ws-chat" , 
            onConnect : () => { 
                setIsConnected( true ); // 1. ********* 접속 상태 변경 *******
                // ********* 2.입력받은 방제목으로 구독 *******
                client.subscribe( `/sub/chat/room/${ roomId }` , (message)=>{
                     messages.push( JSON.parse( message.body ) ); 
                    setMessages( [...messages] );      
                })
                // ********** 3. 입장메시지 발행 ********
                client.publish({
                    destination : "/pub/chat/message",
                    body: JSON.stringify( {type:'ENTER', roomId , sender ,
                         content: '', date: new Date().toLocaleTimeString() })
                });
            }
        }) // client end 
        client.activate()
        clientRef.current = client;
    }
    // 퇴장 함수
    const disconnect = ()=>{ 
        // 1. 퇴장 메시지 발행 
        clientRef.current.publish({
            destination : "/pub/char/message", 
            body: JSON.stringify( {type:'QUIT', roomId , sender ,
                    content: '', date: new Date().toLocaleTimeString() })
        })
        // 2. 소켓 닫기 
        clientRef.current.deactivate();
        setIsConnected( false ); setMessage([]); // 상태변수 초기화
    }


    return (
        <div>
            { !isConnected ? (
                <div>
                    <input value={ roomId } placeholder="방제목/번호 입력"
                        onChange={ (e) =>{ setRoomId( e.target.value ) } } />
                    <input value={ sender } placeholder="채팅 닉네임 입력"
                        onChange={ (e) =>{ setSender( e.target.value) } } />
                    <button type="button" onClick={ connect }> 접속 </button>
                </div>
            ) : (
                <div>
                    <div>
                        <b> 방제목:{ roomId } / 접속자 : { sender } </b>
                        <button type="button" onClick={ disconnect }> 퇴장 </button>
                    </div>
                    <div>
                        { messages.map( (msg)=>{
                            <div>
                                { msg.type === 'TALK' ? (
                                    /* 내가 보낸 메시지 여부 */
                                    msg.sender === sender ? (
                                        <div>
                                            <time>{msg.date} </time>
                                            <p>{ msg.content} </p>
                                        </div>
                                    ) : ( /* 남이 보낸 메시지 */
                                        <div>
                                            <small>{ msg.sender} </small>
                                            <div>
                                                <span> {msg.content } </span>
                                                <p> {msg.date }</p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <i> { msg.content } </i>
                                )}
                            </div>
                        } )}
                    </div>
                    <div>
                        <input value={ message } onChange={ (e)=> setMessage(e.target.value )} />
                        <button type="button" onClick={ sendMessage }> 전송 </button>
                    </div>
                </div>
            )}
        </div>
    )
}
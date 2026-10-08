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

    // 컴포넌트 최초 실행시 1번 실행(탄생)
    useEffect( () => {
        // 2. const client = new Client( { brokerURL : "접속할백엔드브로커주소" , onConnect : 접속성공이벤트  })
        const client = new Client( { 
            brokerURL : "ws://localhost:8080/ws-chat" , // 스프링의 'registerStompEndpoints' 정의 주소와 일치
            // 3. 만약에 stomp 접속 성공시 특정 경로 구독!
            onConnect : () => { // 접속 성공하면 실행되는 이벤트/함수 
                // 특정 경로 구독 신청
                // client.subscribe( "/구독경로" , (message)=>{ 메시지 받았을 때 } ) // 스프링의 'configureMessageBroker' 정의 주소와 일치
                client.subscribe( "/sub/chat/room/general" , (message)=>{
                    // 4.만약에 특정 경로의 구독에서 메시지를 받았을때
                    // * JSON.parse( 문자열->JS객체 변환 ) vs JSON.stringify( JS객체->문자열 변환)
                    // * AXIOS 통신은 JSON 기본값으로 자동 변환 지원!!
                    messages.push( JSON.parse( message.body ) ); // message.body 메시지본문
                    setMessages( [...messages] ); // 렌더링           
                })
            }
        }) // client end 
        // 5. stomp 실행 , client.activate()
        client.activate()
        // 6. client 객체 다른 함수(전송함수) 사용하기 위해
        clientRef.current = client;
        // 7. 만약에 컴포넌트 사라지면(생명주기) , stomp 종료 , client.deactivate();
        return () => { client.deactivate(); }
    } , [ ])

    console.log( messages )
    // *전송시 백엔드에게 메시지 보내기 
    const sendMessage = ( e ) => { 
        console.log( "메시지 보내기"); 
        // 8. 만약에 소켓객체가 없으면 실패
        if( clientRef.current == null ) return;
        // 9. 메시지 전송  , client.publish( { destination : "/발행주소" , body : 내용물 }  )
        // 발행주소: 스프링의 configureMessageBroker 정의된 발행주소 + @MessageMapping 정의된 주소
        const info = {  // 스프링 MessageDto 참조하여 구성 
            type : 'TALK', roomId : "general" ,  sender : "user" ,
            content : message , date : new Date().toISOString()
        } 
        clientRef.current.publish({ 
            destination : "/pub/chat/message"  , 
            body : JSON.stringify( info ) , // JSON.stringify( ) , JS객체->문자열 변환 함수
        })
    }

    
    const [ isConnected , setIsConnected] = useState( false ); // 방 접속 여부
    const [ roomId , setRoomId ] = useState(''); // 입력받은 방
    const [ sender , setSender ] = useState(''); // 접속자(닉네임)
    // 접속 함수
    const connect = ()=>{ }
    // 퇴장 함수
    const disconnect = ()=>{ }
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
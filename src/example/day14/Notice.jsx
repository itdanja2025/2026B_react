import { useEffect, useState } from "react"

export default function Notice( props ){
    const [ notices , setNotices ] = useState([] ); // 알림 목록 
    // 1. SSE 구독 , 컴포넌트가 생성될 때
    // useEffect( ()=>{} , [] ) : 컴포넌트가 생성될 때 딱1번 실행하는 함수
    useEffect( ()=>{
        // 2. SSE 구독 신청 , 내장 라이브러리, new EventSource( 구독주소 );
        const eventSource = new EventSource("http://localhost:8080/api/sse/subscribe")
        // 3. 구독 중 서버가 메시지 보내오면 수신 이벤트
        // eventSource.addEventListener( '이벤트이름' , (e)=> { 메시지받았을때 } ) , 
        // * 스프링 서비스에 SseEmitter.event().name("식별명")
        eventSource.addEventListener( 'notice' , (e)=>{
            // 4. 받은 메시지의 내용은 e.data 확인 가능
            const newNotice ={ id: Math.random() , text : e.data } // id:난수(삭제용), text(받은내용물)
            // 5. 상태에 저장
            notices.push( newNotice );
            setNotices( [...notices ] );
        })
        return ()=>{ // 컴포넌트 제거/사망/사라질 때
            eventSource.close(); // SSE 닫기
        }
    } , [] )


    // 알림 삭제 함수
    const removeNotice = ( id ) => {
        // 만약에 삭제할 id 와 같지 않으면 새로운 리스트로 구성하여 렌더링
        setNotices( notices.filter( (notice) => { return notice.id !== id; } ) );
        // const 새로운리스트 = 리스트.map( (반복변수) => { return 값; })       
        // const 새로운리스트 = 리스트.filter( (반복변수) => { return 조건식; } )
    }

    return (
        <div>
            { notices.map( (notice)=>(
                    <div>
                        <p> { notice.text } </p>
                        <button type="button" 
                            onClick={ () => removeNotice( notice.id ) }> X </button>
                    </div>
                ))
            }
        </div>
    )
}
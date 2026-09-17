import { useEffect, useState } from "react"

function MoveBox( props ){
    const [ position , setPosition ] = useState( 50 ); // position상태/변수에 50대입
    const [ leftCount , setLeftCount ] = useState( 1 ); // leftCount상태/변수에 1 대입 
    const boxStyle = { // css left 속성값을 상태/변수 값으로 사용중
        backgroundColor : 'red' , position : 'relative' , testAlign : 'center',
        width:'100px' , height:'100px', margin: '10px', lineHeight: '100px',
        left: `${position}px`
    }
    const moveLeft = ( ) => { // 한번 클릭시 position 20씩 차감 , 50-20 => 30
        setPosition( position - 20 ); 
        setLeftCount( leftCount + 1 );
    }
    const moveRight = () => { // 한번 클릭시 position 20씩 증가 , 50-20 => 30
        setPosition( position + 20 );
    } 
    // ************* 생명주기 **************** //
    useEffect( ()=>{
        console.log( '***********useEffect 실행************* --> 마운트')
        return ()=>{
            console.log( 'useEffect 실행 --> 언마운트')
        }
    //  } );            // [1] 의존성 배열 생략  : 최초1번실행 , 업데이트
    // } , [ ] );       // [2] 의존성 배열 공백     : 최초1번실행
    },[ leftCount ]);   // [3] 의존성 배열 특정 변수 : 최초1번실행 , 특정변수업데이트

    console.log( 'return실행 --> 렌더링 ')
    return (<>
        <div style={ boxStyle }>{ leftCount }</div>
        <button onClick={ moveLeft }> 좌측이동 </button>
        <button onClick={ moveRight }> 우측이동 </button>
    </>)
}

export default function Lifecycle( props ){
    return (<>
        <MoveBox></MoveBox>
    </>)
}
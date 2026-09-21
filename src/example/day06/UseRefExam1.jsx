import { useRef, useState } from "react";

export default function UseRefExam1( props ){
    // 훅: 리액트에서 만든 다양한 함수들, 컴포넌트와 연관 기능
    // useState, useEffect, useRef 등등
    const [ stateNum , setStateNum ] = useState(0); // state변수
    const refNum = useRef(0); // ref변수
    let myNum = 0; // 지역변수 
    // 렌더링: 함수 재호출 
    const plusState = ( ) => { 
        setStateNum( stateNum +1 ); 
        console.log( stateNum )
    }
    const plusRef = ( )=>{ 
        refNum.current = refNum.current+1 
        console.log( refNum.current )
    }
    const plusMyNum = ( )=>{ 
        ++myNum 
        console.log( myNum )
    }

    //
    return (<>
        <p> state : { stateNum } </p>
        <p> ref : { refNum.current } </p>
        <p> mynum : { myNum } </p>
        <button onClick={ plusState }> useState증가1 </button>
        <button onClick={ plusRef }> useRef증가2 </button>
        <button onClick={ plusMyNum }> 지역변수증가3 </button>
    </>)

}   
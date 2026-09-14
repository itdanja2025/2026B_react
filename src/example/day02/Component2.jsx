// 구조분해 : 객체/배열 내 요소들을 각각 변수로 분해
// const { name , age } = { name:'유재석' , age:40 }
// console.log( name , age );
// const [ name ,setName] = [ '유재석' , functionc setter(){} ]
// console.log( name );  setName( );

import { useState } from "react";
let 전역변수 = 0; // 함수 밖에 변수 
export default function Component2( props ){
    let 지역변수 = 0; // 함수 안에 변수 
    // 1. 전역변수,지역변수 증가함수 : 내부적으로는 증가O, 화면으로는 증가X(return 1번)
    const 증가함수1 = ( ) => { 전역변수++; 지역변수++; console.log( 전역변수, 지역변수 ); }
    
    // 2. useState 함수 이용한 새로고침/재렌더링 ( 함수재호출 --> 함수 return )
    // const [ 상태변수명, set상태변수명 ] = useState( 초기값 );
    // setXXX( 새로운값 ) : 자동으로 현재 함수/컴포넌트 재실행 -> return재실행 , 지역변수(함수내선언된변수)는 초기화
    // 상태변수는 상태/값 유지 된다. 
    const [ count , setCount ] = useState( 0 );
    const 증가함수2 = ( ) => { setCount( count+1 ); }  // 0 -> 1 증가했다면 주소값 변경! 맞다.

    // 3. 수박 요소 1개를 갖는 배열 초기값으로 상태변수 선언
    // 3(상수101호) -> 4(상수102호)  :   1+2 => 3(상수101호) , 리터럴은 고정값=>상수/같이 사용
    // 과일상자(201호)[ 수박(301호) ] ==>  과일상자.push( 사과302호 ) , 과일상자의 주소값은? 201호, 즉] push는 값 변경이 아니고 내부에 추가
    // *** useState 상태(값)의 주소값이 변경되어야만 새로고침이 된다 ***
    // 주로 스프레드연산자 이용하여 배열/객체 복사(주소값 새로만들기)한다. ...객체명 , ...배열명
    const [ array , setArray ] = useState( [ '수박' ] );
    // 배열내 '사과' 요소 추가하여 setXXX 배열을 대입했다. 내부적으로 배열내추가O , 화면으로는 추가안됨X
    const 증가함수3 = ( ) => { 
        // array.push('사과'); setArray( array); 
        array.push( '사과' ); setArray( [ ...array ] ) // [ ...기존배열명 ] 또는 { ...기존객체명 } , 새로운 주소값생성
    }
    return (<>
        <h3> 상태 관리</h3>
        <h4> 전역변수: { 전역변수 } , 지역변수: { 지역변수 } </h4>
        <button onClick={ 증가함수1 }> 버튼1 </button>
        <h4> 상태변수: { count } </h4>
        <button onClick={ 증가함수2 }> 버튼2 </button>
        <h4> 상태변수: { array } </h4>
        <button onClick={ 증가함수3 }> 버튼3 </button>
    </>)
}


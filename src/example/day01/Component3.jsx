// Component3.jsx
// 변수: 하나의 값 저장하는 수 ,
// 매개변수: 함수/메소드에서 (인수)받아서 함수 안에서 사용하는 변수
// 인수/인자값: 함수가 실행될 때 함수에게 전달하는 값 
function plus( x , y ){ } //  함수정의 , x/y 매개변수
plus( 3 , 4 ) // 함수호출 , 3/4 인수 
plus( 5 , 6 ) 
// 즉] 3(인수)를 x(매개변수)에 대입

// 프롭스: 상위컴포넌트에서 하위컴포넌트에게 전달하는 객체 props  , 읽기모드
function plus2( props ){}
plus2( { v1:3 , v2:4 } ) // 3과 4 갖는 객체1개 
// --------------------------------------------------------------- //
export default function Component3( props ){ // -- 상위요소 
    let name = "유재석";
    // --- return 부터 jsx 문법 구역 , 주석주의: { /* 주석 */ }
    // jsx 에서는   HTML문법 { JS표현식 }  HTML문법 { JS표현식 }
    return (<>
        {/* JSX주석 */}
        <div> { name } </div> <div> { 10 + 20 } </div>
        {/* 마크업명 속성명="속성값" 속성명="속성값" 속성명="속성값" */}
        <input type="text" value="안녕" name="입력상자" />
        <SubComp1 name="유재석" age = "40" />
        <SubComp1 name="강호동" age = "50" />
        <SubComp2 name="신동엽" age = "60" />
    </>)
}






function SubComp1( props ){                 // -- 하위요소 
    console.log( props ); // {name: '유재석', age: '40'}
    return (<>
        <h4>{props.name}님 {props.age}세</h4>
    </>)
}
function SubComp2( { name , age } ){
    return(<>
        <h4>{ name }님 {age}세 </h4>
    </>)
}
// props : 객체 { }
// { name , age } = props{} , 구조분해
// 즉] props객체를 name 과 age 변수에 각각 저장 

// 8. 구조 분해 할당: 배열 또는 객체에서 값을 분해 해서 각각 변수/상수 에 저장  
// const { name , age } = obj1 ; // 오른쪽 객체내 왼쪽에 각각 속성값들을 변수/상수에 값 대입
// console.log( name )
// console.log( age )
// const [ name2 , ...array2 ] = obj2; // 오른쪽 배열내 순서대로 값들을 변수/상수에 대입, ...나머지들을
// console.log( name2 )
// console.log( array2 ) // 나머지(그외)















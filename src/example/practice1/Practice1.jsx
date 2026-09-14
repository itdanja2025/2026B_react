// -> src -> example -> practice1 -> Practice1.jsx
/*  컴포넌트 만들기
    1. 첫글자 대문자로 한 컴포넌트명.jsx 파일 생성
    2. export default function 컴포넌트명( props ){ }
    3. 컴포넌트내 return (<> jsx문법 </>)
        * jsx 란? 가상 DOM(HTML) 과 JS 함께 표현 문법
    컴포넌트 최초 렌더링
    1. main.jsx 에서 컴포넌트 import 한다.
    2. import 한 컴포넌트를 create.render( <컴포넌트/> )
*/
export default function Practice1( props ){ // 상위 
    const data = [
    { name: 'Hedy Lamarr', imageUrl: 'https://i.pravatar.cc/150?img=47' },
    { name: 'Grace Hopper', imageUrl: 'https://i.pravatar.cc/150?img=48' },
    { name: 'Ada Lovelace', imageUrl: 'https://i.pravatar.cc/150?img=49' },
    { name: 'Margaret Hamilton', imageUrl: 'https://i.pravatar.cc/150?img=50' }
  ];
  return (<>
    <Profile name={ data[0].name } imageUrl={ data[0].imageUrl }></Profile>
    <Profile name={ data[1].name } imageUrl={ data[1].imageUrl } />
    { /* JSX 주석 */}
    {
        data.map( ( i ) => { 
            return(<>
                <Profile name={ i.name } imageUrl = { i.imageUrl } />
            </>) })
    }
  </>)
}
/*
    {  <---- JS 시작 
        data.map( ( i ) => {   <-- data 반복하여 요소 하나씩 i 반복대입
            return(<>           <-- 반복하면서 반환되는 값/HTML/컴포넌트
                <Profile name={ i.name } imageUrl = { i.imageUrl } />
            </>) })
    }  <---- JS 끝
    // VS 1개월
    let html = ''
    for( let index = 0 ; index < data.length ; index++ ){
        let i = data[index];
        html += `<div> 
                    <h3> ${ i.name } </h3>
                    <img src=${ i.imageUrl } />
                </div>`
    }
*/







function Profile( props ) {  // 하위 
  return (<>
      <h3> { props.name } </h3>
      <img src={ props.imageUrl } />
  </> );
} // func end 
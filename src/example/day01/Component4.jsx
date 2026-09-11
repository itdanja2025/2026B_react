// Component4.jsx 만들고 87~88 코드 따라서 작성
function FrontComp( props ){
    const liRows = []; // 배열
    for( let i = 0 ; i<props.propData1.length ; i++ ){
        // 부모로 부터 전달받은 props내 propData1 반복
        liRows.push( <li key={i} >{ props.propData1[i] } </li> )
        // 배열명.push( 값 ); // 배열내 값 추가
    }
    return(<>
        <li>{props.frTitle}</li>  <ul>  { liRows }  </ul>
    </>)
}
// 원래 props 객체인데 구조분해 하여 propData2 변수와 baTitle 변수로 각각 저장
function BackComp( { propData2 , baTitle } ){ 
    const liRows = []; 
    for( let i = 0 ; i<propData2.length ; i++ ){
        liRows.push( <li key={i} >{ propData2[i] } </li> )
    }
    return(<>
        <li>{ baTitle }</li>  <ul>  { liRows }  </ul>
    </>)
}

// App -> Component4
export default function Component4( props ){
    // *추후에 연동할 백엔드 와 통신 AXIOS *
    const frontData = [ 'HTML5', 'CSS3' , 'Javascript', 'jQuery', "React" ];
    const backData = [ 'Java' , 'Oracle' , 'JSP' , 'Spring Boot'  ] 
    return (<>
        <div>
            <h2> 리액트 프롭스 </h2>
            <ol>
                <FrontComp propData1={frontData} frTitle="프론트엔드"/>
                <BackComp propData2={backData} baTitle="벡엔드" />
            </ol>
        </div>
    </>)
}

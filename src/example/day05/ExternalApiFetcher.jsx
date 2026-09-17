import { useState, useEffect } from "react";
import axios from "axios";

function RandomUser( props ){
    // 객체 안에 빈배열 속성으로 초기화
    // API 응답 결과 저장하는 상태/변수
    const [myJSON , setMySJON] = useState( {results :[] }); 

    // useEffect( () => { 하고싶은코드 } , [ ] ) // 최초 1번만 실행
    // AXIOS 이용하여 API 통신 하고 응답결과 상태변수에 저장
    useEffect( async function(){
        const response = await axios.get( "https://api.randomuser.me?results=10"); 
        const data = response.data;
        setMySJON( data ); // 통신 응답결과 상태변수에 대입 --> 렌더링 
    } , []);

    // 현재 상태변수에 존재하는 리스트들을 tr 구성하여 하나씩 html 만들기
    let trTag = myJSON.results.map( (data)=>{
        return (
        <tr key={ data.login.md5 }>
            <td> <img src={data.picture.thumbnail } /> </td>
            <td> <a href="/" onClick={ (e)=>{
                e.preventDefault();
                props.onProfile( data );
            }}>{data.login.username }</a> </td>
            <td> {data.name.title} { data.name.first}  { data.name.last} </td>
            <td> {data.nat} </td> <td> {data.email } </td>
        </tr>)
    });

    // 간단한 표 이용하여 위에서 정의한 tr 대입한다.
    return (
        <div>
            <table border="1">
                <thead>
                    <tr> <th> 사진 </th> <th> 로그인 </th> <th> 이름 </th>
                    <th> 국가</th> <th> 이메일</th></tr>
                </thead>
                <tbody> { trTag } </tbody>
            </table>
        </div>
    )
}
export default function ExternalApiFetcher( props ){
    return (<>
        <RandomUser onProfile={ (sData)=>{
            let info = `전화번호:${sData.cell} 성별: ${sData.gender }
                        username: ${sData.login.username } password: ${sData.login.password }`
            alert( info );
        } }>
        </RandomUser>
    </>)
}
/*
    axios란? API 비동기통신
    - 주로 외부API 와 백엔드API(controller) 통신 도구
    - content-type 기본값이 application/json 
    1. 사용법(동기화 통신)
        const 함수명 = async( ) => {
            const response = await axios.HTTP메소드명( "통신할주소?쿼리스트링" , {body} );
            const data = response.data
        }
*/

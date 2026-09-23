import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function List( props ){
    // useState 사용하는 이유 : 상태가 바뀌었을 때, 재렌더링 하기위해서 
    const [boardData , setBoardData] = useState([]);
    let requestUrl = "http://localhost:8080/api";

    const 전체조회 = async()=>{
        const response = await axios.get( requestUrl );
        const data = response.data; // response 응답결과 , response.data: 응답결과 본문
        console.log( response )
        setBoardData( data ); // 통신 결과 상태변수에 넣어서 재렌더링한다.
    }
    useEffect( function () {
         전체조회 ();
    },[ ]); // useEffect 에서 최초 한번만 실행: useEffect( ()=>{} , [] )

    let lists = boardData.map( (row) => {
    
        let date = row.regdate.substring(0,10);     // substring : 0 인덱스부터 10 인덱스까지 자르기 : 0000-00-00
        let subject = row.subject.substring(0,20);  
        
        return (<>
            <tr key={row.idx}>
                <td className="cen">{row.idx}</td>
                <td><Link to={"/view/"+row.idx}>{subject}</Link></td>
                <td className="cen">{row.name}</td>
                <td className="cen">{date}</td>
            </tr>
        </>);
    });

    return (<>
        <header>
            <h2>게시판-목록</h2>
        </header>
        <nav>
            <Link to={"/write"}>글쓰기</Link>
        </nav>
        <article>
            <table id="boardTable">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {lists}
                </tbody>
            </table>
        </article>
    </>);
}
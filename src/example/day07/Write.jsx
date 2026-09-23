import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Write( props ){
    const navigate = useNavigate(); // [1] 화면 이동하기 위한 훅
    // *등록함수
    const 등록함수 = async ( event )=>{
        event.preventDefault();
        console.log( event.target ) // 등록함수 등록한 마크업
        // 이벤트 발생시킨 form 마크업내 name 속성으로 입력값 반환
        const obj = { 
            name : event.target.writer.value , 
            subject: event.target.title.value , 
            content : event.target.contents.value 
        }
        // axios( url , body ); // 백엔드에게 HTTP POST 통신
        const response = await axios.post("http://localhost:8080/api", obj );
        const data = response.data;
        if( data == true ){ navigate("/list")} // 반환값이 true이면 페이지전환
    }

    return (<>
        <div>
            <Link to="/list"> 목록 </Link>
            <form onSubmit={ (event) => { 등록함수(event); } }>
                작성자 : <input name="writer"/> <br/>
                제목 : <input name="title" /> <br/>
                내용 : <textarea name="contents" row="3"></textarea> <br/>
                <input type="submit" value="작성" />
            </form>
        </div>
    </>)
}
/*
    // html: <a href=""> ,      REACT: <Link to="">
    // js: location.href="" ,   REACT: navigate("")
    // * html/js 코드는 깜빡거림. *
*/
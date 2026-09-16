import { Link } from "react-router-dom";
export default function NotFound( props ){
    return (<>
        <h3> 오류 페이지 </h3>
        <Link to="/">홈으로</Link>
    </>)
}
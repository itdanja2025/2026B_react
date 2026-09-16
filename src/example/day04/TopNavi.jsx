import { Link, NavLink } from "react-router-dom";
export default function TopNavi( props ){
    return (<>
        <div>
            <a href="/"> Home1, </a> {/* html 링크 마크업 */}
            <NavLink to = "/"> Home2,  </NavLink>
            <NavLink to = "/intro"> 인트로,  </NavLink>
            <NavLink to = "/intro/router"> 라우터관련훅,  </NavLink>
            <Link to = "/xyz"> 잘못된주소, </Link>
        </div>
    </>)
}
// <a href="이동할경로"> 텍스트 </a>                : 페이지 로드(새로고침) 있다.
// <NavLink to = "이동할경로"> 텍스트 </NavLink>    : 페이지 로드(새로고침) 없다.
// <Link to = "이동할경로"> 텍스트 </Link>          : 페이지 로드(새로고침) 없다. active클래스가없다.
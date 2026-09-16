import { useLocation, useSearchParams } from "react-router-dom"

export default function RouterHooks( props ){
    const location = useLocation();
    const [searchParams , setSearchParams ] = useSearchParams();
    // searchParams.get('변수명');
    const mode = searchParams.get('mode');
    const pageNum = searchParams.get('pageNum')

    const changeMode = ( ) => { // mode 값이 list 이면 view 아니면 list
        const nextMode = (mode ==='list') ? 'view' : 'list'; 
        setSearchParams( { mode : nextMode , pageNum } )
    }
    const nextPage = () => {  // 페이지번호가 null 이면 1 아니면 +1 , parseInt( ) 문자->정수변환
        let pageTemp = (pageNum === null || isNaN(pageNum) ) 
                        ? 1 : parseInt(pageNum)+1; 
        setSearchParams( { mode , pageNum : pageTemp } )
    }
    const prevPage = () => {  // 페이지번호가 null 이면 1 아니면 -1 , parseInt( ) 문자->정수변환
        let pageTemp = (pageNum === null || isNaN(pageNum) ) 
                        ? 1 : parseInt(pageNum)-1; 
        setSearchParams( { mode , pageNum : pageTemp } )
    }

    return (<>
        <div>
            <ul>
                <li> URL: { location.pathname } </li>
                <li> 쿼리스트링: {location.search } </li>
                <li> mode : { mode } </li>
                <li> pageNum : { pageNum } </li>
            </ul>
            <button onClick={ changeMode }> 모드변경 </button>
            <button onClick={ prevPage }> 이전페이지 </button>
            <button onClick={ nextPage }> 다음페이지 </button>
        </div>
    </>)
}
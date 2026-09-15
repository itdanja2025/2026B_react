// p.110 
const BackComp = ( { onMyEvent2 } ) => {
    return (<>
        <li>
            <a href="/" onClick={ 
                ( )=>{ onMyEvent2('벡엔드 클릭됨'); 
            } } > 백엔드 </a>
        </li>
        <ul>
            <li> Java </li>
            <li> Oracle </li>
            <li> JSP </li>
            <li> Spring Boot </li>
        </ul>
    </>)
}
export default BackComp;

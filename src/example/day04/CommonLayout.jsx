import { Outlet } from "react-router-dom";
export default function CommonLayout( props ){
    return (<>
        <div>  컴포넌트 헤더 </div>
        <div>
            <Outlet/> {/*여기에 하위 컴포넌트가 표시되는 위치*/ }
        </div>
        <div>  컴포넌트 푸터  </div>
    </>)
}
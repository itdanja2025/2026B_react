import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import TopNavi from "./TopNavi";
import NotFound from "./NotFound";
export default function App( props ){
    return (<> 
        <TopNavi></TopNavi>
        <Routes> {/* 여기에 들어가는 경로들은 주소정의에 따라 렌더링 */}
            <Route path="/" element={ <Home/> } />
            <Route path="*" element={ <NotFound/> } />
        </Routes>
    </>)
}
// <Route path="/도메인이후주소정의" element={ <컴포넌트/> } />
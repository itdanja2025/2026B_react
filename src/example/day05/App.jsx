import { Route, Routes } from "react-router-dom";
import TopNavi from "./TopNavi";
import Lifecycle from "./Lifecycle";

export default function App( props ){
    return (<> 
        <TopNavi> </TopNavi>
        <Routes>
            <Route path="/" element={ <Lifecycle /> }/>
        </Routes>
    </>)
}
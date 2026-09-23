import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import List from "./List";

export default function App( props ){

    return (<>
        <Routes>
            {/* <Route path="/" element={<List />} /> */}
            <Route path="/list" element={<List />} />
            {/* <Route path="/write" element={<Write />} /> */}
            {/* <Route path="/view"/> */}
            {/* <Route path=":idx" element={<View />} /> */}
            {/* path="*" : 와일드카드 (모든주소) */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    </>)
}
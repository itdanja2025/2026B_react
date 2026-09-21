import { NavLink } from "react-router-dom";

export default function TopNavi( props ){
    return (
        <div>
            <NavLink to="/use-ref1"> useRef1 </NavLink>
            <NavLink to="/use-ref1"> useRef2 </NavLink>
        </div>
    )
}
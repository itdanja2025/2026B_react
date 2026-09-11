// Component2.jsx 만들고 78~79 코드 따라서 작성
// App.jsx -> Component2.jsx 
// 1. 선언적함수 방법으로 컴포넌트 생성
function FrontComp( props ){
    return (<>
        <li> 프론트엔드 </li>
        <ul>
            <li> HTML 5 </li>
            <li> CSS 3 </li>
            <li> Javscript </li>
            <li> jQuery </li>
        </ul>
    </>)
}
// 2. 화살표함수 방법으로 컴포넌트 생성
const BackComp = ( props ) => {
    return (<>
        <li> 백엔드 </li>
        <ul>
            <li> java </li>
            <li> oracle </li>
            <li> jsp </li>
            <li> spring </li>
        </ul>
    </>)
}

// 3. 익명함수 방법으로 컴포넌트 생성
const FormComp = function( props ){
    return (<>
        <form>
            <select>
                <option> 프론트엔드 </option>
                <option> 백엔드 </option>
            </select>
            <input />
            <input type="submit" value="추가" />
        </form>
    </>)
}
// 4. 3가지의 컴포넌트 합치는 컴포넌트 , 79p 와 다르게 App -> Component2
export default function Component2( props ){
    return (<>
        <div>
            <h2> 리액트 컴포넌트 </h2>
            <ol>
                <FrontComp></FrontComp>
                <BackComp/>
            </ol>
            <FormComp />
        </div>
    </>)
}



// 컴포넌트 만드는방법
// 1. 폴더 오른쪽클릭 -> new file 
// 2. 첫글자는 대문자로 시작하는 .jsx 파일 생성 
// 3. export default function 컴포넌트명( props ){ }
// 4. 컴포넌트내 return (<>  JSX문법 </>)

// p.111 , 컴포넌트 가져오기? 다른 jsx 파일 에서 컴포넌트 가져오기
import BackComp from "./BackComp";
import FrontComp from "./FrontComp";

export default function Component1( props ){
    return (<>
        <h3> Chapter6 p.110 </h3>
        <ol>
            <FrontComp  ></FrontComp>
            <BackComp onMyEvent2={ (msg) => { 
                alert(msg);
            }}></BackComp>
        </ol>
    </>);
}

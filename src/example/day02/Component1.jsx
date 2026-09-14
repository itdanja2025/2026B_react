import FrontComp from './FrontComp.jsx'
import BackComp from './BackComp.jsx'
function Component1( props ){
    return (<> 
        <h2> 리액트 모듈</h2>
        <ol>
            <FrontComp onMyEvent1={ ()=> { alert('프론트 클릭됨'); } } />
            <BackComp onMyEvent2 ={ (msg)=>{ alert(msg); } }/>
        </ol>
    </>)
}
export default Component1;
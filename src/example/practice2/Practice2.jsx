import { useState } from "react"

export default function Practice2( props ){ // HTML --> CSS --> JS
    const [ name , setName ] = useState( '' ) // 일반변수가 아닌 상태변수 사용.
    const [ phone , setPhone ] = useState( '' );
    const [ age , setAge ] = useState( 0 ) ;
    const [ members , setMembers ] = useState( [ ] ); // 빈배열 선언 
    // --- 등록함수 ---
    const 등록함수 = ( ) => { 
        const obj = { name , phone , age } // 입력받은 값 3개를 객체로 만든다.
        members.push( obj ); // 배열에 만든 객체 저장
        setMembers( [ ...members ] ) // 렌더링 위한 members setter 에 스프레드연산자로 배열복사
    }
    // --- 삭제함수 ---
    const 삭제함수 = ( index )=> {
        members.splice( index , 1 ) // JS에서 특정 인덱스에서 1개 삭제
        setMembers( [...members ] ) // 렌더링 위한 코드!!!
    }
    return (<>
        <input value={ name } onChange={ (e) => { setName(e.target.value); }} />
        <input value={ phone} onChange={ (e) => { setPhone(e.target.value); } }/>
        <input value={ age } onChange={ (e) => { setAge(e.target.value); }} />
        <button onClick={ 등록함수 }> 등록 </button>

        <br />
        {
            members.map( ( m , index)=> {
                return (<>
                    <div>
                        <span> 성명: {m.name} </span>
                        <span> 연락처: {m.phone} </span>
                        <span> 나이: {m.age} </span>
                        { index }
                        <button onClick={ ()=>{ 삭제함수(index) } }> 
                            삭제 
                        </button>
                    </div>
                </>);
            })
        }
        <div> 총 인원 : { members.length }명 </div>
    </>)   
}
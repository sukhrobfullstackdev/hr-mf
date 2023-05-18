import Style from "styled-components";


const Wrapper = Style.div`
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    padding: .2rem 0;
    font-size: 12px;
    color: #ffff;
    overflow: hidden;
    background-color: #06C975;
    z-index: 9;
`
function TestMode(){
    return  <Wrapper>
               <div className='test-mode'>
                   Tizim test rejimida ishlamoqda!
               </div>
            </Wrapper>
}
export default TestMode;
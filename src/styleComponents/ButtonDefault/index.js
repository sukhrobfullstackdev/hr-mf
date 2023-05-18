import Style from "styled-components";

export const ButtonDefault = Style.button`
    background-color: transparent;
    border:none;
    cursor: pointer;
    &.salary-btn{
        border: 1px solid #f1f1f1;
        padding: 0.7rem 1.5rem;
        border-radius: 8px;
        height: 100%;
        transition: all 0.25s linear;
    }
    &.active{
        border: 1px solid #f2f2f2;
        background-color: #f1f1f1;
    }
`
export const OrderButtons = Style.div`
    position: absolute;
    right: 10px;
    bottom: 10px;
`
export const ButtonLink = Style.button`
  border:none;
  background-color: transparent; 
  cursor: pointer;
  color: #2842C8;
  &:hover{
    opacity: 0.8;
  }
`
export default  ButtonDefault;
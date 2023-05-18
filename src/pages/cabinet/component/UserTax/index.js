import {useEffect, useState} from "react";
import AppTabel from "../../../../components/AppTabel";
import {GET_USER_TAX} from "../../../../store/types";
import {connect} from "react-redux";
import Small from "../../../../styleComponents/Small";

function UserTax({userTaxInfo}){
    const [columns,setColumns] = useState([
        {
            title: 'Manzil',
            dataIndex: 'address'
        },{
            title: 'Soliq turi',
            dataIndex: 'listTax',
            render:(_,col)=>{
                return(
                    col.listTax.map(item=>{
                        return (
                            <Small key={`taxList${item.na2Code}`}>
                                {item.na2Name}
                            </Small>
                        )
                    })
                )
            }
        },{
            title: 'Soliq summasi',
            dataIndex: 'listTax',
            render:(_,col)=>{
                return(
                    col.listTax.map(item=>{
                        return (
                            <Small key={`taxList${item.na2Code}`}>
                                To'lov: {item.nachislen} so'm, Oldindan to'lov: {item.pereplata}
                            </Small>
                        )
                    })
                )
            }
        }
    ]);
    return(
        <AppTabel columns={columns} type={GET_USER_TAX} data={userTaxInfo}/>
    )
}
const stp = state =>{
    return{
        userTaxInfo: state.userTaxInfo || []
    }
}
export default connect(stp)(UserTax);
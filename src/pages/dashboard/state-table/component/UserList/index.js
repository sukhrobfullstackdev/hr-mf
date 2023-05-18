import {Modal, Radio} from "antd";
import Style from "styled-components";
import AppTable from "../../../../../components/AppTabel";
import {useEffect, useState} from "react";
import Req from "../../../../../store/api";
import {GET_TABLE_USER_LIST, TABLE_SET_STATUS} from "../../../../../store/types";
import {connect, useDispatch} from "react-redux";
import Search from "antd/es/input/Search";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import {IconSearch} from "../../../../../components/Icon";

const DisplayFlex = Style.div`
    display: flex;
    justify-content: ${p=> p.jc};
`
const Title = ({date})=>{
    return  <DisplayFlex jc='space-between'>
                <div>
                    <strong>Ishchi-hodimlar</strong>
                </div>
                <div className="pr-5">
                   <strong>{date}</strong>
                </div>
            </DisplayFlex>
}
const RadioGroup = ({data,onSet})=>{
    const [choose,setChoose] = useState();
    useEffect(()=>{
        setChoose(data?.choices[0]?.status)
    },[data])
    const changed = (e)=>{
        setChoose(e.target.value)
        onSet(e.target.value,data.staff.id)
    }
    return  <Radio.Group name="radiogroup" onChange={changed} value={choose}>
                <Radio value={'C'}>Ishga keldi</Radio>
                <Radio value={'CH'}>Ishga kelmadi</Radio>
                <Radio disabled={true}  value={'X'}>Xizmat safarida</Radio>
                <Radio disabled={true}  value={'K'}>Bemor</Radio>
                <Radio disabled={true} value={'MT'}>Mexnat ta'tili</Radio>
                <Radio disabled={true}  value={'U'}>O'quv ta'tili</Radio>
                <Radio disabled={true}  value={'PT'}>Haq to'lanmaydigan ta'til</Radio>
            </Radio.Group>
}
function UserList({isShow = false, selectedDay = null,tableUserList, onClose}){
    const [query,setQuery] = useState({date: selectedDay});
    const dispatch = useDispatch();
    const setStatus = function (value,id){
        dispatch({
            type: 'loader',
            payload: true,
        })
        Req({
            type:TABLE_SET_STATUS,
            data:{
                date: selectedDay,
                choices: [{
                    staff: id,
                    status: value
                }]
            }
        }).then(res=>{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'success',
                    message: "Saqlandi!"
                }
            })
        }).catch(err=>{
            const {data,status} = err.response;
            if(status < 500){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: data?.message
                    }
                });
                if(status === 401 || status === '401'){
                    localStorage.removeItem('token');
                    dispatch({
                        type: 'isUser',
                        payload: null
                    });
                    navigate('/login')
                }
            }else{
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Tizim hatoligi qayta urinib ko'ring!"
                    }
                });
            }
        }).finally(()=>{
            dispatch({
                type: 'loader',
                payload: false,
            })
        })
    }
    const [columns,setColumns] = useState([
        {
            title: 'F.I.Sh.',
            dataIndex: 'userName',
            width: '22%',
            render: (_,record)=>{
                return <p className="m-0">{record.staff?.full_name}</p>
            }
        },
        {
            title: "Ishchi-xizmati holati",
            render:(_,record)=>{
                return <RadioGroup data={record} onSet={setStatus}/>
            }
        }
    ]);
    const onSearch = (value)=>{
        if(value && value !== ''){
            setQuery({
                ...query,
                search: value,
            })
        }else{
            setQuery({date: selectedDay});
        }
    }
    return  <Modal
                width="70%"
                title={<Title date={selectedDay}/>}
                visible={isShow}
                footer={null}
                onCancel={onClose}
            >
                <div className="position-relative">
                    <div className="mb-3">
                        <Search
                            allowClear
                            enterButton={
                                <ButtonDefault>
                                    <IconSearch/>
                                </ButtonDefault>
                        }
                            placeholder="F.I.Sh."
                            onSearch={onSearch}
                            style={{
                                width: '100%',
                            }}
                        />
                    </div>
                    <AppTable type={GET_TABLE_USER_LIST} search={query} data={tableUserList} columns={columns}/>
                </div>
            </Modal>
}
const stp = (state)=>{
    return{
        tableUserList: state.tableUserList || [],
    }
}
export default connect(stp)(UserList);
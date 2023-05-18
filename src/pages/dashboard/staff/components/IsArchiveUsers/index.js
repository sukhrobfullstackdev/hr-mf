import {Col, Row} from "antd";
import Search from "antd/es/input/Search";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import {IconSearch} from "../../../../../components/Icon";
import UserList from "../../../../../components/UserList";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {GET_STAFF_IS_ARCHIVE} from "../../../../../store/types";

function IsArchiveUsers({page,pageSize}){
    const [search,setQuery] = useState(null);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(search){
            dispatch({
                type: GET_STAFF_IS_ARCHIVE,
                payload:{
                    dontPage: true,
                    query: {
                        search: search
                    }
                }
            });
        }
        else{
            dispatch({
                type: GET_STAFF_IS_ARCHIVE,
                payload:{
                    query: {
                        page_size: pageSize,
                        page: page,
                    }
                }
            })
        }
    },[search,pageSize,page])
    const onSearch = (value)=>{
        if(value && value !== ''){
            setQuery(value)
        }else{
            setQuery(null);
        }
    }
    return(
        <div>
            <Row justify="end" className="py-3" gutter={8} align="middle">
                <Col span={4} className="text-right">
                    F.I.Sh. bo'yicha qidiruv:
                </Col>
                <Col span={6}>
                    <Search
                        allowClear
                        enterButton={<ButtonDefault><IconSearch/></ButtonDefault>}
                        placeholder="F.I.Sh."
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                        }}
                    />
                </Col>
            </Row>
            <UserList/>
        </div>
    )
}
export default IsArchiveUsers;
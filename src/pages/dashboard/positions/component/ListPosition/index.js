import {Button, Col, Popconfirm, Row} from "antd";
import {Link} from "react-router-dom";
import {IconEdit, IconPlus, IconSearch, IconTrash} from "../../../../../components/Icon";
import AppTable from "../../../../../components/AppTabel";
import {useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {GET_POSITIONS, REMOVE_POSITIONS} from "../../../../../store/types";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import Search from "antd/es/input/Search";

function ListPosition({positions, loader}){
    const [query,setQuery] = useState({});
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'Lavozim nomi',
            dataIndex: 'position_name_uz',
        },{
            title: 'Razryad',
            dataIndex: 'razryad',
            render:(_,record) => record.razryad || record.razryad,
            sorter:(a,b) => a.razryad - b.razryad
        },{
            title: 'Soni',
            dataIndex: 'count',
            sorter:(a,b) => a.razryad - b.razryad
        }
        ,{
            title: "Bo'lim",
            dataIndex: 'department',
        },
        {
            title: 'Amallar',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                return(
                    <div className="text-center">
                        <Link to={`/dashboard/positions/${record.id}`}  className="ant-btn ant-btn-primary mr-2 ant-btn-sm">
                            <IconEdit color="#fff"/> Tahrirlash
                        </Link>
                        <Popconfirm placement="top" title={"O'chirishni tasdiqlang!"} onConfirm={()=>onRemove(record.id)} okText="O'chirish" cancelText={'Yopish'}>
                            <Button type='danger' size="small">
                                <IconTrash color="#fff"/> Remove
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        },
    ]);
    const form = useRef();
    const dispatch = useDispatch();
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_POSITIONS,
            payload: id
        })
    };
    const onReset = ()=>{
        form.current?.resetFields();
        setQuery(null);
    }
    const onSearch = (value)=>{
        if(value && value !== ''){
            setQuery({
                search: `${value}`
            })
        }else{
            setQuery(null)
        }
    }
    return  (
        <>
            <Row justify='end' align='middle'>
                <Col span={20}>
                    <h3>
                        <strong>Lavozimlar</strong>
                    </h3>
                </Col>
                <Col span={4} className="text-right">
                    <Link className="ant-btn ant-btn-primary" to={`add`}>
                        <IconPlus color="#fff"/> Qo'shish
                    </Link>
                </Col>
            </Row>
            <Row justify='end' align='middle' gutter={16} className="mt-3">
                <Col span={6} className="text-right">
                    Bo'lim, lavozim nomi va razryad bo'yicha:
                </Col>
                <Col span={8}>
                    <Search
                        allowClear
                        enterButton={<ButtonDefault><IconSearch/></ButtonDefault>}
                        placeholder="Bo'lim, lavozim nomi"
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <AppTable
                        search={query}
                        type={GET_POSITIONS}
                        loader={loader}
                        columns={columns}
                        data={positions}
                    />
                </Col>
            </Row>
        </>
    )
}
export default connect((s)=>{
    return{
        positions: s.positions || [],
        loader: s.loader || false
    }
})(ListPosition);
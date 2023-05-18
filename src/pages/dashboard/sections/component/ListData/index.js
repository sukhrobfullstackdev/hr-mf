import {Button, Card, Col, Popconfirm, Row, Skeleton} from "antd";
import {Link} from "react-router-dom";
import {IconEdit, IconPlus, IconSearch, IconTrash} from "../../../../../components/Icon";
import AppTable from "../../../../../components/AppTabel";
import {connect, useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {GET_SECTION, REMOVE_SECTION} from "../../../../../store/types";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import Search from "antd/es/input/Search";

function ListData({sections}){
    const loader = useSelector(s=>s?.loader);
    const dispatch = useDispatch();
    const [search,setQuery] = useState(null);
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'Nomi',
            dataIndex: 'label',
        },{
            title: 'Toifasi',
            dataIndex: 'department_type_id',
        },{
            title: 'Amallar',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                return(
                    <div className="text-center">
                        <Link to={`/dashboard/sections/${record.id}`}  className="ant-btn ant-btn-primary mr-2 ant-btn-sm">
                            <IconEdit color="#fff"/> Tahrirlash
                        </Link>
                        <Popconfirm placement="top" title={"O'chirishni tasdiqlang!"} onConfirm={()=>onRemove(record.id)} okText="O'chirish" cancelText="Yopish">
                            <Button type='danger' size="small">
                                <IconTrash color="#fff"/> O'chirish
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        },
    ]);
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_SECTION,
            payload: id
        })
    }
    const onSearch = (value)=>{
        if(value && value !== ''){
            setQuery({
                search: value
            })
        }else{
            setQuery(null);
        }
    }
    return(
        <Row justify='end' align='middle' gutter={16}>
            <Col span={20}>
                <h3>
                    <strong>Bo'lim va guruxlar</strong>
                </h3>
            </Col>
            <Col span={4} className="text-right">
                <Link className="ant-btn ant-btn-primary" to={`add`}>
                    <IconPlus color="#fff"/> Qo'shish
                </Link>
            </Col>
            <Col span={16} className="text-right mt-3">
                Bo'lim yoki gurux nomi bo'yicha qidiruv:
            </Col>
            <Col span={8} className="mt-3">
                <Search
                    allowClear
                    enterButton={<ButtonDefault><IconSearch/></ButtonDefault>}
                    placeholder="Bo'lim nomi"
                    onSearch={onSearch}
                    style={{
                        width: '100%',
                    }}
                />
            </Col>
            <Col span={24}>
                <AppTable
                    search={search}
                    loader={loader}
                    type={GET_SECTION}
                    columns={columns}
                    data={sections}
                />
            </Col>
        </Row>
    )
}
export default connect((s)=>{
    return{
        sections: s.sections || []
    }
})(ListData);
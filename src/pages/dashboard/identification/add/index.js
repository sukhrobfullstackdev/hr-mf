import {useGetDynamic} from "../../../../hooks/useGet";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {GET_STAFF} from "../../../../store/types";
import {Button, Card, Checkbox, Col, Input, message, Row} from "antd";
import AppTable from "../../../../components/AppTabel";
import {Link} from "react-router-dom";
import {IconChevronLeft, IconSearch} from "../../../../components/Icon";
import {connect} from "react-redux";
import Search from "antd/es/input/Search";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";

function AddIdentification({staff,loader}){
    const [query,setQuery] = useState(null);
    const [users,setUsers] = useState([]);
    const [columns, setColumns] = useState([
        {
            title: '',
            width: '2%',
            dataIndex: 'checkbox',
            render: (_,record)=>{
                return <Checkbox onChange={()=>onSelect(record)}/>
            }
        },{
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'F.I.Sh',
            dataIndex: 'fill_name',
            render: (_,record)=>{
                return <p className="m-0 text-capitalize">{record.full_name.toLowerCase() || 'Mavjud emas!'}</p>

            }
        },{
            title: 'Passport',
            dataIndex: 'passport_seria',
        },{
            title: "Tug'ilgan sanasi",
            dataIndex: 'birth_date',
        }
    ]);
    const [postLoader, setPostLoader] = useState(false);
    const link = useRef();
    const onSelect =(user)=>{
        addUser(user.id);
    }
    const addUser =  useCallback((id)=>{
        const set = users;
        const index = set.indexOf(id);
        if(index > -1){
            set.splice(index,1);
        }else{
            set.push(id);
        }
        setUsers(set)
    },[users]);
    const onGenerate =()=>{
        if(!users.length){
            message.error('Iltimos hodim tanlgan!');
        }else{
            const token = localStorage.getItem('token');
            link.current.href = `${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/mf_id/test/?token=${token}&user_ids=${users.join('-')}`;
            link.current.target ="_blank"
            link.current.click();
        }
    }
    const onSearch = (value)=>{
        if(value && value !== ''){
            setQuery({
                search: value
            })
        }else{
            setQuery(null)
        }

    }
    const table = useMemo(()=>{
        return(
            <>
                <AppTable
                    search={query}
                    type={GET_STAFF}
                    loader={loader}
                    columns={columns}
                    data={staff}
                />
                <a href="" ref={link}/>
            </>
        )
    },[users,loader,staff,query]);
    return  <>
                <Row className="mb-4">
                    <Col span={24} className="text-right">
                        <Link to="/dashboard/identification" className="ant-btn ant-btn-primary">
                            <IconChevronLeft/> Ortga qaytish
                        </Link>
                    </Col>
                </Row>
                <Card>
                    <Row align="middle" gutter={16} className="mb-4">
                        <Col span={12}>
                            <h4 className="mb-0">Hodimlarni tanlang</h4>
                        </Col>
                        <Col span={4} className="text-right">
                            F.I.Sh. bo'yicha qidiruv:
                        </Col>
                        <Col span={8}>
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
                    {
                        table
                    }
                    <div className="text-center mt-4">
                        <Link to="/dashboard/identification" className="mr-2 ant-btn ant-btn-danger">
                            Bekor qilish
                        </Link>
                        <Button disabled={postLoader} type="primary" onClick={onGenerate}>
                            Guvoxnoma generatsitya qilish
                        </Button>
                    </div>
                </Card>
            </>
}
const stp = (state)=>{
    return{
        staff: state.staffs || [],
        loader: state.loader || false
    }
}
export default connect(stp)(AddIdentification);
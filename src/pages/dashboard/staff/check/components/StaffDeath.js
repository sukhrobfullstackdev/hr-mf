import {Button, Col, Form, InputNumber, Row, Skeleton} from "antd";
import {IconSearch} from "../../../../../components/Icon";
import usePost from "../../../../../hooks/usePost";
import {useEffect, useState} from "react";
import {CHECK_STAFF_DEATH} from "../../../../../store/types";
import AppTabel from "../../../../../components/AppTabel";

function StaffDeath(){
    const [post,loader,res] = usePost(false);
    const [data,setData] = useState([]);
    const [columns,setColumns] = useState([
        {
            title: 'Fuqaro',
            dataIndex: 'surname',
            render:(_,col)=>{
                return(
                   `${col.surname} ${col.name} ${col.patronym}`
                )
            }
        },{
            title: "Xujjat seriasi  va raqami",
            dataIndex: 'cert_number',
            render:(_,col)=>{
                return `${col.cert_series} ${col.cert_number}`
            }
        },{
            title: 'Vafot etgan sanasi',
            dataIndex: 'death_date'
        },{
            title: 'Vafot etgan joyi',
            dataIndex: 'death_place'
        }
    ]);
    const onSearch = (v)=>{
        post(CHECK_STAFF_DEATH,v);
    }
    useEffect(()=>{
        if(res){
            setData(res.data.items || []);
        }
    },[res])
    return(
        <div>
            <Form
                name="narcologieForm"
                onFinish={onSearch}
                layout='horizontal'
            >
                <Row gutter={16} justify="end">
                    <Col>
                        <Form.Item
                            name='pinfl'
                            label="Hodim yoki fuqaro PINFL ni kiriting"
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos kiriting!'
                                }
                            ]}
                        >
                            <InputNumber max={99999999999999} min={10000000000000} placeholder='PINFL kiriting'/>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">
                            <IconSearch/> Qidiruv
                        </Button>
                    </Col>
                </Row>
            </Form>
            {
                loader ?
                    <Skeleton active/>:
                    <AppTabel data={data} columns={columns}/>
            }
        </div>
    )
}
export default StaffDeath;
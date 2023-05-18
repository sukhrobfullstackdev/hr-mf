import usePost from "../../../../../hooks/usePost";
import {useEffect, useState} from "react";
import {CHECK_STAFF_DIVORCED, CHECK_STAFF_MARRIAGE} from "../../../../../store/types";
import {Button, Col, Form, InputNumber, Row, Skeleton} from "antd";
import {IconSearch} from "../../../../../components/Icon";
import AppTabel from "../../../../../components/AppTabel";

function StaffMarriage(){
    const [post,loader,res] = usePost(false);
    const [data,setData] = useState([]);
    const [columns,setColumns] = useState([
        {
            title: `Turmush o'rtog'i (Erkak)`,
            dataIndex: 'surname',
            render:(_,col)=>{
                return(
                    `(${col.h_family}) ${col.h_family_after} ${col.h_patronym}  ${col.h_first_name}`
                )
            }
        },{
            title: `Turmush o'rtog'i (Ayol)`,
            dataIndex: 'surname',
            render:(_,col)=>{
                return(
                    `(${col.w_family}) ${col.w_family_after}  ${col.w_patronym}  ${col.w_first_name}`
                )
            }
        },{
            title: "Xujjat seriasi  va raqami",
            dataIndex: 'cert_number',
            render:(_,col)=>{
                return `${col.cert_series} ${col.cert_number}`
            }
        }
    ]);
    const onSearch = (v)=>{
        post(CHECK_STAFF_MARRIAGE,v);
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
export default StaffMarriage
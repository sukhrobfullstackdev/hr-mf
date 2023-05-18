import {Button, Card, Form, Skeleton} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {GET_ONE_SECTION, UPDATE_SECTION} from "../../../../store/types";
import {connect, useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo} from "react";

function UpdateSections({section = {}, loader = true}){
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(()=>{
        if(id){
            dispatch({
                type: GET_ONE_SECTION,
                payload: {
                    id: id
                }
            })
        }
    },[id]);
    const onFinish = (v)=>{
        dispatch({
            type: UPDATE_SECTION,
            payload: {
                ...v,
                id: id,
                key: 'section',
                redirectUrl: 'sections'
            }
        })
    }
    return (
        <Card>
            <Title>
                Bo'lim yoki gurux qo'shish
            </Title>
            {
                Object.keys(section).length && !loader?
                    <Form
                        initialValues={section}
                        name='companyForm'
                        layout='vertical'
                        onFinish={onFinish}
                    >
                        <FormItem/>
                        <Form.Item className="text-right">
                            <Link to="/dashboard/sections" className="ant-btn ant-btn-danger mr-3">
                                <ArrowLeftOutlined /> Bekor qilish
                            </Link>
                            <Button type="primary" htmlType='submit'>
                                <SaveOutlined /> Saqlash
                            </Button>
                        </Form.Item>
                    </Form> : <Skeleton active/>
            }

        </Card>

    )
}
export default connect((s)=>{
    return {
        section: s?.section,
        loader: s?.loader
    }
})(UpdateSections);
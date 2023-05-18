import {Button, Card, Form, Skeleton} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {GET_ONE_POSITIONS, UPDATE_POSITIONS} from "../../../../store/types";
import {connect, useDispatch} from "react-redux";
import {useEffect} from "react";

function UpdatePosition({position = {}, loader = false}){
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(()=>{
        if(id){
            dispatch({
                type: GET_ONE_POSITIONS,
                payload: {
                    id: id
                }
            })
        }
    },[id])
    const onFinish = (v)=>{
        dispatch({
            type: UPDATE_POSITIONS,
            payload: {
                ...v,
                position_total: parseInt(v.position_total),
                razryad: parseInt(v.razryad),
                id: id,
                redirectUrl: 'positions'
            }
        })
    }
    return (
        <Card>
            <Title>
                Lavozimni taxrirlash
            </Title>
            {
                Object.keys(position).length && !loader?
                    <Form
                        name='positionForm'
                        layout='vertical'
                        initialValues={position}
                        onFinish={onFinish}
                    >
                        <FormItem/>
                        <Form.Item className="text-right">
                            <Link to="/dashboard/positions" className="ant-btn ant-btn-danger mr-3">
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
        position: s?.position,
        loader: s?.loader
    }
})(UpdatePosition);
import {Button, Form, Input} from "antd";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AUTH} from "../../../../store/types";

function LoginForm(props){
    const dispatch = useDispatch()
    const onFinish=(v)=>{
        dispatch({
            type: AUTH,
            payload: v
        })
    }
    return(
        <Form
            name="loginForm"
            layout='vertical'
            onFinish={onFinish}
            initialValues={{ remember: true }}
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder="User name"/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder='Enter your password!'/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="ant-btn-100">
                    Tizimga kirish
                </Button>
            </Form.Item>
            <p className="text-center">
                <Link to={'/'}>
                    Parolni unutdingizmi!
                </Link>
            </p>
        </Form>
    )
}
export default LoginForm;
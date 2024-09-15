import React, {useState} from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {Alert, Button, Form, Input, FormProps} from 'antd';

import sideImage from '../assets/images/mansitwriting.png';
import background from '../assets/images/background-stones.jpg';
import {UserLogin} from "../types/user.type";
import '../assets/css/login.css';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {login} from "../store/authSlice";

export const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    // const [userLogin, setUserLogin] = useState<IRoomInfo>(initialRoomState);
    const [message, setMessage] = useState("");

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    const onFinish: FormProps<UserLogin>['onFinish'] = (userLogin: UserLogin) => {
        setLoading(true);

        dispatch(login(userLogin))
            .unwrap()
            .then((originalPromiseResult) => {
                // handle result here
                navigate("/home");
                // window.location.reload();
            })
            .catch((rejectedValueOrSerializedError) => {
                // handle error here
                console.log(rejectedValueOrSerializedError);
                setMessage("Wrong user name or password")
                setLoading(false);
            })
    };

    const onFinishFailed: FormProps<UserLogin>['onFinishFailed'] = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };

    if (isLoggedIn) {
        return <Navigate to="/home"/>
    }

    return (
        <div className="login-page"
             style={{
                 backgroundImage: `url(${background}`,
                 backgroundPosition: 'center',
                 backgroundSize: 'cover',
             }}
        >
            <div className="login-box">
                <div className="illustration-wrapper">
                    <img
                        src={sideImage}
                        alt="Login"/>
                </div>
                <Form
                    name="login-form"
                    // labelCol={{span: 8}}
                    // wrapperCol={{span: 36}}
                    // style={{width: 600}}
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <p className="form-title">Welcome back</p>
                    <p>Login to the Dashboard</p>
                    <Form.Item<UserLogin>
                        // label="Username"
                        name="username"
                        rules={[{
                            min: 3,
                            max: 100,
                            required: true,
                            message: 'Please input your username with at least 3 characters!'
                        }]}
                    >
                        <Input placeholder="Username"/>
                    </Form.Item>

                    <Form.Item<UserLogin>
                        // label="Password"
                        name="password"
                        rules={[{
                            min: 6,
                            max: 100,
                            required: true,
                            message: 'Please input your password with at least 6 characters!'
                        }]}
                    >
                        <Input.Password placeholder="Password"/>
                    </Form.Item>

                    {/*<Form.Item<UserLogin>*/}
                    {/*    name="remember"*/}
                    {/*    valuePropName="checked"*/}
                    {/*    wrapperCol={{offset: 8, span: 16}}*/}
                    {/*>*/}
                    {/*    <Checkbox>Remember me</Checkbox>*/}
                    {/*</Form.Item>*/}
                    {
                        message && <Alert message={message}/>
                    }

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button type="primary" htmlType="submit"
                                loading={loading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
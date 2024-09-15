import React, {useEffect, useState} from "react";

import {ICameraData, ImageResponse, IRoomInfo} from "../types/IRoomData.type";
import RoomService from "../services/room.service";

import { useNavigate } from "react-router-dom";


import {
    Modal,
    Button,
    message,
    Form,
    Input,
    Switch,
    InputNumber,
    Select,
    Card,
    Space, Popconfirm, PopconfirmProps,
} from 'antd';
import {CloseOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {updateRoom} from "../store/roomSlice";

const {Option} = Select;

export const UpdateRoom = (room_: IRoomInfo) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user: currentUser} = useAppSelector((state) => state.auth);

    const room_id = room_._id == null ? '' : room_._id.toString();
    const room_name = room_.name;
    let [allowedUpdate, setAllowedUpdate] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const [form] = Form.useForm<IRoomInfo>();

    const [room, setRoom] = useState<IRoomInfo>(room_);
    let cameraIds: string[] = []
    if (room_.camera !== undefined) {
        cameraIds = room_.camera.map((cam: ICameraData) => {
            return cam.camera_id;
        })
    }

    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleWatchForm = Form.useWatch((values) => {
        setRoom(values)
    }, form);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
        const {name, value} = e.target;
        setRoom({...room, [name]: value});
    }

    

    if (currentUser && currentUser.role.includes("admin")) {
        allowedUpdate = true;
    }

    useEffect(() => {
        form.setFieldsValue(room);
    }, []);

    const cancel: PopconfirmProps['onCancel'] = (e) => {
    };


    const onFinish = () => {
        RoomService.updateRoom(room_id, room)
            .then((response: any) => {
                if (room._id == null) room._id = room_id;
                dispatch(updateRoom(room));
                message.success(`Updated room ${room.name} successfully.`);
                setSubmitted(true);
            })
            .catch((e: Error) => {
                if (axios.isAxiosError(e)) {
                    console.log(e);
                    message.error(`Could not create room cause ${e.request.response}`);
                } else {
                    console.error(e);
                }
            });
    };

    const clickHandler = () => {
        const camId = cameraIds[0]
        navigate('/coordinates', {state: {room_id, camId}})
    };

    const onFinishFailed = () => {
        // console.log('Submit failed!');
    };

    const onReset = () => {
        form.setFieldsValue(room_);
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleOk = () => {
        setOpen(false);
    };


    return (
        <>
            <EditOutlined key="edit" onClick={showModal}/>
            <Modal
                title={<p>Room {room_name}</p>}
                open={open}
                onCancel={handleCancel}
                onOk={handleOk}
                centered
            >
                <Card>
                    <Form
                        disabled={!allowedUpdate}
                        form={form}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        labelCol={{
                            // flex: '110px',
                            span: 8
                        }}
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            // flex: 1,
                            span: 24
                        }}
                        colon={false}
                        style={{
                            maxWidth: 1000,
                        }}
                        // layout="vertical"
                    >
                        <Form.Item<IRoomInfo>
                            label="Room name"
                            name="name"
                            rules={[
                                {
                                    required: true, message: 'Please enter a room name!'
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item<IRoomInfo>
                            label="Capacity"
                            name="capacity"
                            rules={[
                                {
                                    required: true, message: 'Please enter capacity of the room!'
                                },
                            ]}
                        >
                            <InputNumber/>
                        </Form.Item>

                        <Form.Item<IRoomInfo>
                            label="Active"
                            name="active"
                            valuePropName="checked"
                            initialValue={room.active}
                            rules={[
                                {
                                    required: true, message: 'Please choose status of the room!'
                                },
                            ]}
                        >
                            <Switch checkedChildren="Yes" unCheckedChildren="No"/>
                        </Form.Item>

                        <Form.List name="camera">
                            {(fields, {add, remove}) => (
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    rowGap: 16,
                                    columnGap: 16
                                }}>
                                    {fields.map((field, index) => (
                                        <Card
                                            size="small"
                                            title={`Camera ${field.name + 1}`}
                                            key={field.key}
                                            extra={
                                                <Button disabled={!allowedUpdate}
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                >
                                                    <CloseOutlined

                                                    />
                                                </Button>
                                            }
                                        >
                                            <Form.Item
                                                label="Camera id"
                                                name={[field.name, 'camera_id']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input disabled={index < room_.camera!.length ?
                                                    cameraIds.includes(room_.camera![index].camera_id) : false}/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Camera ip"
                                                name={[field.name, 'camera_ip']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Video source"
                                                name={[field.name, 'video_source']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter a camera id!'
                                                    },
                                                ]}
                                            >
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Encode"
                                                name={[field.name, 'encode']}
                                                rules={[
                                                    {
                                                        required: true, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <Select>
                                                    <Option value="h264">H264</Option>
                                                    <Option value="h265">H265</Option>
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                label="Width"
                                                name={[field.name, 'camera_width']}
                                                rules={[
                                                    {
                                                        required: false, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <InputNumber/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Height"
                                                name={[field.name, 'camera_height']}
                                                rules={[
                                                    {
                                                        required: false, message: 'Please enter the encode type!'
                                                    },
                                                ]}
                                            >
                                                <InputNumber/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Split line"
                                                name={[field.name, 'split_line']}
                                                rules={[
                                                    {
                                                        required: false, message: "Please enter the normalized coordinate of two point!"
                                                    }
                                                ]}
                                            >
                                                <Input/>
                                                <Button 
                                                type="primary"
                                                onClick={() => clickHandler()}>
                                                    To locate two endpoints
                                                </Button>
                                            </Form.Item>
                                        </Card>
                                    ))}
                                    <Form.Item>

                                        <Button type="dashed"
                                                onClick={() => add()}
                                                style={{width: '100%'}}
                                                block
                                                icon={<PlusOutlined/>}
                                        >
                                            Add Camera
                                        </Button>
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>

                        <Form.Item>
                            <Space>
                                <Popconfirm
                                    title="Update the room"
                                    description="Are you sure to update this room?"
                                    onConfirm={() => {
                                        form.submit();
                                    }}
                                    onCancel={cancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary">
                                        Update
                                    </Button>
                                </Popconfirm>
                                <Button htmlType="button" onClick={onReset}>
                                    Reset
                                </Button>
                            </Space>
                        </Form.Item>

                    </Form>
                </Card>
            </Modal>
        </>
    )
}

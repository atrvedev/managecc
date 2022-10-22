import React, { useState, useEffect } from 'react';
import axios from "axios";
import { dateFormat } from "../utils";
import { Form, Input, Button, InputNumber, DatePicker, Tabs, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
const { TabPane } = Tabs;



const CreateCode = () => {
    let navigate = useNavigate();

    const getApi = async (url, params) => {
        params.type = 1
        params.minLevel = 1
        params.startedAt = ""
        const response = await axios.get(
            url, { params }
        )
        console.log(response);
        if (response.data.data) {
            message.success(response.data.msg);
            navigate('/home');
        }
    }


    const onFinish = (values) => {
        values.expiredAt = dateFormat(values.expiredAt, "#YYYY#-#MM#-#DD#")
        console.log('Success:', values);
        getApi("https://tienlen.vip:2083/api/bo/giftcode/create", values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    const onFinish2 = (values) => {
        values.expiredAt = dateFormat(values.expiredAt, "#YYYY#-#MM#-#DD#")
        console.log('Success:', values);
        getApi("https://tienlen.vip:2083/api/bo/giftcode/random", values)
    };

    const onFinishFailed2 = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    function disabledDate(current) {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }



    const renderForm1 = () => {
        return (
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                labelAlign="left"
                wrapperCol={{
                    span: 8,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Mã code"
                    name="code"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        }, {
                            pattern: /^[A-Z0-9]*$/,
                            message: 'Gồm chữ in hoa và số',
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số lượng nhận"
                    name="number"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Xu nhận"
                    name="goldGet"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Thời gian hết hạn"
                    name="expiredAt"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <DatePicker disabledDate={disabledDate} onChange={() => { }} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 4,
                        span: 4,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Tạo GiftCode
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    const renderForm2 = () => {
        return (
            <Form
                name="basic"
                labelCol={{
                    span: 4,
                }}
                labelAlign="left"
                wrapperCol={{
                    span: 8,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish2}
                onFinishFailed={onFinishFailed2}
                autoComplete="off"
            >
                <Form.Item
                    label="Khúc đầu Mã Code"
                    name="prefix"
                    rules={[
                        {
                            required: false,
                            message: 'Không để trống!',
                        }, {
                            pattern: /^[A-Z0-9]*$/,
                            message: 'Gồm chữ in hoa và số',
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Khúc sau Mã Code"
                    name="suffix"
                    rules={[
                        {
                            required: false,
                            message: 'Không để trống!',
                        }, {
                            pattern: /^[A-Z0-9]*$/,
                            message: 'Gồm chữ in hoa và số',
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Chiều dài Code"
                    name="length"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Số lượng Ngẫu Nhiên"
                    name="number"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Xu nhận"
                    name="goldGet"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label="Thời gian hết hạn"
                    name="expiredAt"
                    rules={[
                        {
                            required: true,
                            message: 'Không để trống!',
                        },
                    ]}
                >
                    <DatePicker disabledDate={disabledDate} onChange={() => { }} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 4,
                        span: 4,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Tạo Ngẫu Nhiên
                    </Button>
                </Form.Item>
            </Form>
        )
    }

    return (
        <Tabs defaultActiveKey="1" type="line">
            <TabPane tab="Thủ công" key="1">
                {renderForm1()}
            </TabPane>
            <TabPane tab="Ngẫu nhiên" key="2">
                {renderForm2()}
            </TabPane>

        </Tabs>

    );

};

export default CreateCode;

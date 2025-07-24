import React from "react";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

const roleOptions = [
    { label: "CNBM", value: "CNBM" },
    { label: "TM", value: "TM" },
    { label: "GV", value: "GV" },
    { label: "Student", value: "Student" },
];

export const LecturerCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Tên" name="name" rules={[{ required: true }]}> 
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}> 
                    <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone"> 
                    <Input />
                </Form.Item>
                <Form.Item label="Loại người dùng" name="user_type" initialValue="default"> 
                    <Select options={[{ label: "Default", value: "default" }]} />
                </Form.Item>
                <Form.Item label="Vai trò" name="role" rules={[{ required: true }]} initialValue="GV"> 
                    <Select options={roleOptions} />
                </Form.Item>
                <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked" initialValue={true}> 
                    <Switch />
                </Form.Item>
            </Form>
        </Create>
    );
};

export default LecturerCreate; 
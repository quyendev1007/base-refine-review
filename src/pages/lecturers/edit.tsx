import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

const roleOptions = [
    { label: "CNBM", value: "CNBM" },
    { label: "TM", value: "TM" },
    { label: "GV", value: "GV" },
    { label: "Student", value: "Student" },
];

export const LecturerEdit: React.FC = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item name="id" hidden>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item label="Tên" name="name" rules={[{ required: true }]}> 
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}> 
                    <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone"> 
                    <Input />
                </Form.Item>
                <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}> 
                    <Select options={roleOptions} />
                </Form.Item>
                <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked"> 
                    <Switch />
                </Form.Item>
            </Form>
        </Edit>
    );
};

export default LecturerEdit; 
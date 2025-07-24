import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch } from "antd";

export const UserEdit: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({ resource: "users" });
    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Tên" name="name" rules={[{ required: true }]}> <Input /> </Form.Item>
                <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}> <Input /> </Form.Item>
                <Form.Item label="Vai trò" name="role" rules={[{ required: true }]}> <Select options={[{ value: "GV", label: "Giảng viên" }, { value: "CNBM", label: "CNBM" }]} /> </Form.Item>
                <Form.Item label="Trạng thái" name="isActive" valuePropName="checked"> <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" /> </Form.Item>
                <Form.Item label="Số điện thoại" name="phone"> <Input /> </Form.Item>
            </Form>
        </Edit>
    );
};

export default UserEdit;

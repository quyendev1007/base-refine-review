import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import React from "react";

export const ProductEdit = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Name"}
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Description"}
          name={["description"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Price"}
          name={["price"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};

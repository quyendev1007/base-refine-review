import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { Form, Input, Modal, Select, Space } from "antd";
import { spaceChildren } from "antd/es/button";

export const TasksEditPage = () => {
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "edit",
    defaultVisible: true,
    meta: {},
  });

  const categorySelectProps = {
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  };

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Edit card"
      width={512}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          formProps?.onFinish?.({
            ...values,
          });
        }}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Space style={{ justifyContent: "space-between", width: 100 }}>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            style={{ width: 150 }}
            label={"Priority"}
            name={["priority"]}
            initialValue={formProps?.initialValues?.priority || "low"}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...categorySelectProps} />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

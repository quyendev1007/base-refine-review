import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { Form, Input, Modal } from "antd";

export const TasksEditPage = () => {
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "edit",
    defaultVisible: true,
    meta: {},
  });

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
        <Form.Item label="DueDate" name="dueDate" rules={[{ required: true }]}>
          <Input type="date" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

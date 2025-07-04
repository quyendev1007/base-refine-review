import { useSearchParams } from "react-router";

import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { Form, Input, Modal } from "antd";

export const TasksCreatePage = () => {
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
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
      title="Add new card"
      width={512}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values) => {
          formProps?.onFinish?.({
            ...values,
            stageId: searchParams.get("stageId")
              ? Number(searchParams.get("stageId"))
              : null,
            userIds: [],
            complete: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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

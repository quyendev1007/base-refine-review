import { Edit, useForm } from "@refinedev/antd";
import { Checkbox, Form, Input, Select } from "antd";

export const UserEdit = () => {
  const { formProps, saveButtonProps } = useForm({});

  const permissions = ["create", "update", "delete", "read", "assign"];

  const roles = [
    { label: "Giáo viên", value: "GV" },
    { label: "Học sinh", value: "Student" },
    { label: "Trưởng môn", value: "TM" },
    { label: "Chủ nhiệm môn", value: "CNM" },
  ];

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Tên người dùng" name="name">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Vai trò" name="role">
          <Select options={roles} />
        </Form.Item>

        <Form.Item label="User Permissions" name="permissions">
          <Checkbox.Group>
            {permissions.map((perm) => (
              <Checkbox key={perm} value={perm}>
                {perm}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Edit>
  );
};

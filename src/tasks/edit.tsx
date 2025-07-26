import { useModalForm } from "@refinedev/antd";
import { HttpError, useForm, useList, useNavigation } from "@refinedev/core";

import {
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  Button,
  Card,
  Divider,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import type { SelectProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { TaskFormValues } from "../types/Task";
import { debounce } from "lodash";

interface ISemester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
  blocks: Block[];
}

interface Block {
  name: string;
}

export const TasksEditPage = () => {
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "edit",
    defaultVisible: true,
    meta: {},
  });
  const form = formProps.form;

  // Hàm xác định kỳ học dựa trên tháng
  const getSemesterFromMonth = (month: number) => {
    if (month >= 1 && month <= 4) return "Spring";
    if (month >= 5 && month <= 9) return "Summer";
    return "Fall";
  };

  // Hàm xác định kỳ học dựa trên ngày
  const getSemesterFromDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const season = getSemesterFromMonth(month);
    return `${year}-${season}`;
  };

  const semesterSelectProps = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;

    const seasons = [
      { name: "Spring", month: 1 },
      { name: "Summer", month: 5 },
      { name: "Fall", month: 9 },
    ];

    const options: { label: string; value: string }[] = [];

    for (const { name, month } of seasons) {
      const semesterDate = new Date(currentYear, month - 1, 1);
      if (semesterDate >= new Date(currentYear, now.getMonth(), 1)) {
        options.push({
          label: `${name} ${currentYear}`,
          value: `${currentYear}-${name}`,
        });
      }
    }

    for (const { name } of seasons) {
      options.push({
        label: `${name} ${nextYear}`,
        value: `${nextYear}-${name}`,
      });
    }

    return { options };
  }, []);

  const defaultSemesterValue = useMemo(() => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const season = getSemesterFromMonth(month);
    return `${year}-${season}`;
  }, []);

  const { data: users } = useList({
    resource: "users",
  });

  const userSelectProps: SelectProps<any> = {
    mode: "multiple",
    options: users?.data.map((user) => ({
      label: user.name,
      value: user.id,
    })),
    placeholder: "Chọn người thực hiện",
  };

  const prioritySelectProps = {
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  };

  interface UserOption {
    id: string;
    name: string;
    email: string;
  }

  const [assigneeOptions, setAssigneeOptions] = useState<UserOption[]>([]);

  const fetchUsers = async (query: string) => {
    const res = await fetch(`http://localhost:3000/users?email_like=${query}`);
    const data = await res.json();
    setAssigneeOptions(data);
  };

  const debounceFetcher = useMemo(() => debounce(fetchUsers, 400), []);
  useEffect(() => {
    fetchUsers(""); // nạp tất cả user để hiển thị được assignee đã lưu
  }, []);

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Chỉnh sửa công việc"
      width={720}
      style={{ top: 40 }}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: any) => {
          const formattedAssignees = values.assignees?.map((id: string) => ({
            userId: id,
            response: "",
            progress: 0,
          }));

          formProps?.onFinish?.({
            ...values,
            assignees: formattedAssignees,
          });
        }}
        initialValues={{
          ...formProps.initialValues,
          assignees: formProps.initialValues?.assignees?.map(
            (a: any) => a.userId
          ),
        }}
        onValuesChange={(
          changedValues: Partial<TaskFormValues>,
          allValues: TaskFormValues
        ) => {
          // Tự động cập nhật kỳ học khi thay đổi ngày bắt đầu hoặc kết thúc
          if (changedValues.startDate || changedValues.endDate) {
            const form = formProps?.form;
            if (!form) return;

            // Ưu tiên ngày bắt đầu, nếu không có thì dùng ngày kết thúc
            const dateToUse = changedValues.startDate || changedValues.endDate;

            if (dateToUse) {
              const newSemester = getSemesterFromDate(dateToUse);

              if (newSemester) {
                // Sử dụng setTimeout để đảm bảo cập nhật sau khi form đã render
                setTimeout(() => {
                  form.setFieldsValue({
                    semester: newSemester,
                  });
                }, 0);
              }
            }
          }
        }}
      >
        <Card size="small" title="Thông tin cơ bản">
          <Form.Item
            label="Tiêu đề công việc"
            name="title"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tiêu đề..." />
          </Form.Item>

          <Form.Item
            label="Mô tả chi tiết"
            name="description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả..." />
          </Form.Item>
        </Card>

        <Divider />

        <Card size="small" title="Thời gian & học kỳ">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ước lượng (giờ)"
                name="estimate"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Kỳ học" name="semester">
            <Select placeholder="Chọn kỳ học" {...semesterSelectProps} />
          </Form.Item>
        </Card>

        <Divider />

        <Card size="small" title="Phân công & mức độ ưu tiên">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Người thực hiện"
                name="assignees"
                rules={[{ required: true }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn người thực hiện"
                  {...userSelectProps}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Mức độ ưu tiên"
                name="priority"
                initialValue={formProps?.initialValues?.priority || "low"}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Chọn độ ưu tiên"
                  {...prioritySelectProps}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        <Card size="small" title="Tài liệu / File đính kèm">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Đường dẫn tài liệu"
                name="link"
                rules={[{ type: "url", message: "URL không hợp lệ" }]}
              >
                <Input placeholder="https://example.com/tailieu" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="File đính kèm"
                name="file"
                valuePropName="file"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.file?.response?.url || e?.file?.url;
                }}
              >
                <Upload
                  name="file"
                  action="https://api.example.com/upload" // sửa lại endpoint thật
                  listType="text"
                  maxCount={1}
                  defaultFileList={
                    formProps?.initialValues?.file
                      ? [
                          {
                            uid: "-1",
                            name: "Tệp đã tải lên",
                            status: "done",
                            url: formProps.initialValues.file,
                          },
                        ]
                      : []
                  }
                >
                  <Button icon={<UploadOutlined />}>Tải file lên</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* subtask */}
        <Form.List name="subtasks">
          {(fields, { add, remove }) => {
            const usedIndexes = fields.map((_, idx) => idx + 1);

            return (
              <>
                <Typography.Title level={5}>Nhiệm vụ con</Typography.Title>
                <div
                  style={{
                    padding: 16,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    background: "#fafafa",
                  }}
                >
                  {fields.map(({ key, name }, index) => {
                    const displayTitle = `Nhiệm vụ ${index + 1}`;

                    return (
                      <div
                        key={key}
                        style={{
                          marginBottom: 24,
                          padding: 16,
                          border: "1px dashed #ccc",
                          borderRadius: 8,
                          background: "#fff",
                        }}
                      >
                        <Row justify="space-between">
                          <Col>
                            <Typography.Text strong>
                              {displayTitle}
                            </Typography.Text>
                          </Col>
                          <Col>
                            <Button
                              danger
                              size="small"
                              onClick={() => remove(name)}
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>

                        <Form.Item
                          name={[name, "title"]}
                          label="Tiêu đề nhiệm vụ"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập tiêu đề",
                            },
                          ]}
                        >
                          <Input placeholder="Nhập tiêu đề nhiệm vụ con" />
                        </Form.Item>

                        <Row gutter={12}>
                          <Col span={12}>
                            <Form.Item
                              name={[name, "assignee"]}
                              label="Người thực hiện"
                            >
                              <Select
                                showSearch
                                placeholder="Tìm kiếm theo email"
                                onSearch={debounceFetcher}
                                filterOption={false}
                                options={assigneeOptions.map((user) => ({
                                  label: `${user.name} (${user.email})`,
                                  value: user.email,
                                }))}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={[name, "startDate"]}
                              label="Ngày bắt đầu"
                            >
                              <Input type="date" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={[name, "endDate"]}
                              label="Ngày kết thúc"
                            >
                              <Input type="date" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name={[name, "priority"]}
                          label="Mức độ ưu tiên"
                        >
                          <Select
                            placeholder="Chọn mức độ"
                            options={[
                              { label: "Thấp", value: "low" },
                              { label: "Trung bình", value: "medium" },
                              { label: "Cao", value: "high" },
                            ]}
                          />
                        </Form.Item>
                      </div>
                    );
                  })}

                  <Button
                    type="dashed"
                    block
                    onClick={() =>
                      add({
                        title: `Nhiệm vụ ${fields.length + 1}`,
                        assignee: null,
                        startDate: "",
                        endDate: "",
                        priority: "medium",
                      })
                    }
                  >
                    + Thêm nhiệm vụ con
                  </Button>
                </div>
              </>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};

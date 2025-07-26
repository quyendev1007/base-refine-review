import { useSearchParams } from "react-router";

import { useModalForm } from "@refinedev/antd";
import { useList, useNavigation } from "@refinedev/core";

import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { SelectProps } from "antd";
import { TaskFormValues } from "../types/Task";
import { debounce } from "lodash";

// Type definitions

export const TasksCreatePage = () => {
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
    defaultVisible: true,
    meta: {},
  });

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

  const prioritySelectProps = {
    options: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  };

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

  // tìm kiếm cho assignees

  type AssigneeOption = { userId: string; [key: string]: any };
  const [assigneeOptions, setAssigneeOptions] = useState<AssigneeOption[]>([]);

  const fetchUsers = async (query: string) => {
    try {
      const res = await fetch(
        `http://localhost:3000/users?email_like=${query}`
      );
      const data = await res.json();
      setAssigneeOptions(data);
    } catch (err) {
      console.error("Không tìm thấy người dùng được chỉ định", err);
    }
  };

  // Debounce API call (chỉ gọi khi user ngừng nhập 400ms)
  const debounceFetcher = useMemo(() => debounce(fetchUsers, 400), []);
  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title="Tạo mới công việc"
      width={720}
      style={{ top: 40 }}
    >
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(values: TaskFormValues) => {
          const formattedAssignees = values.assignees?.map((id: string) => ({
            userId: id,
            response: "",
            progress: 0,
          }));

          formProps?.onFinish?.({
            ...values,
            assignees: formattedAssignees,
            stageId: searchParams.get("stageId") ?? null,
            userIds: [],
            complete: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }}
        initialValues={{
          priority: "low",
          semester: defaultSemesterValue,
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

          <Form.Item
            label="Kỳ học"
            name="semester"
            rules={[{ required: true }]}
          >
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
                rules={[{ required: true }]}
              >
                <Select {...prioritySelectProps} />
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
                  action="https://api.example.com/upload"
                  listType="text"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải file lên</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>
        {/* subtask */}
        <Form.List name="subtasks">
          {(fields, { add, remove }) => (
            <>
              <Typography.Title level={5}>Nhiệm vụ con</Typography.Title>

              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: 8,
                  padding: 16,
                  backgroundColor: "#fafafa",
                }}
              >
                {fields.length === 0 && (
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <Typography.Text type="secondary">
                      Chưa có nhiệm vụ con nào được thêm.
                    </Typography.Text>
                  </div>
                )}

                {fields.map(({ key, name }) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: 24,
                      padding: 16,
                      border: "1px dashed #d0d0d0",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Typography.Text strong>
                          Nhiệm vụ {key + 1}
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

                    <Form.Item name={[name, "title"]} label="Tiêu đề nhiệm vụ">
                      <Input placeholder="Nhập tiêu đề nhiệm vụ con" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "assignee"]}
                          label="Người thực hiện"
                        >
                          <Select
                            showSearch
                            placeholder="Tìm theo email"
                            // Thêm logic lọc ở đây nếu cần
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

                    <Form.Item name={[name, "priority"]} label="Mức độ ưu tiên">
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
                ))}

                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      title: "",
                      assignee: null,
                      startDate: "",
                      endDate: "",
                      priority: "medium",
                    })
                  }
                  block
                >
                  + Thêm nhiệm vụ con
                </Button>
              </div>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

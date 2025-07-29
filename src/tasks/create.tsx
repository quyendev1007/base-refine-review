"use client";

import { useSearchParams } from "react-router";
import { useModalForm } from "@refinedev/antd";
import { useList, useNavigation } from "@refinedev/core";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
  Space,
  Avatar,
  Layout,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FlagOutlined,
  LinkOutlined,
  MessageOutlined,
  StarOutlined,
  PlusOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import type { SelectProps } from "antd";
import type { TaskFormValues } from "../types/Task";
import { debounce } from "lodash";

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

export const TasksCreatePage = () => {
  const [searchParams] = useSearchParams();
  const { list } = useNavigation();
  const { formProps, modalProps, close } = useModalForm({
    action: "create",
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  return (
    <Modal
      {...modalProps}
      onCancel={() => {
        close();
        list("tasks", "replace");
      }}
      title={null}
      width={1200}
      style={{ top: 20 }}
      footer={null}
      bodyStyle={{ padding: 0, height: "80vh" }}
    >
      <Layout style={{ height: "100%" }}>
        <Content style={{ padding: "24px", overflow: "auto" }}>
          <Form
            {...formProps}
            layout="vertical"
            onFinish={(values: TaskFormValues) => {
              const formattedAssignees = values.assignees?.map(
                (id: string) => ({
                  userId: id,
                  response: "",
                  progress: 0,
                })
              );

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
                const dateToUse =
                  changedValues.startDate || changedValues.endDate;
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
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                Tạo mới công việc
              </Title>
            </div>

            <div
              style={{
                padding: "14px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: 8,
              }}
            >
              {/* Task Title */}
              <div style={{ marginBottom: 24 }}>
                <Form.Item name="title" rules={[{ required: true }]}>
                  <Input
                    placeholder="Nhập tiêu đề công việc..."
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      border: "none",
                      padding: 0,
                      background: "rgba(255, 255, 255, 0.7)",
                      boxShadow: "none",
                    }}
                  />
                </Form.Item>
              </div>

              {/* AI Suggestions */}
              {/* <div
                style={{
                  background: "#f0f8ff",
                  border: "1px solid #d6e4ff",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 24,
                }}
              >
                <Space size="small" wrap>
                  <StarOutlined style={{ color: "#1890ff" }} />
                  <Text style={{ color: "#1890ff" }}>Ask Brain to</Text>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto" }}
                  >
                    write a description
                  </Button>
                  <Text style={{ color: "#1890ff" }}>·</Text>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto" }}
                  >
                    create a summary
                  </Button>
                  <Text style={{ color: "#1890ff" }}>·</Text>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto" }}
                  >
                    find similar tasks
                  </Button>
                  <Text style={{ color: "#1890ff" }}>·</Text>
                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, height: "auto" }}
                  >
                    or ask about this task
                  </Button>
                </Space>
              </div> */}

              {/* Task Properties Grid */}
              <div style={{ marginBottom: 32 }}>
                <Row gutter={[16, 16]}>
                  {/* Status */}
                  <Col span={12}>
                    <Space align="center">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: "#d9d9d9",
                        }}
                      />
                      <Text strong style={{ minWidth: 80 }}>
                        Status
                      </Text>
                      <Select
                        defaultValue="todo"
                        style={{ width: 120 }}
                        size="small"
                      >
                        <Select.Option value="todo">TO DO</Select.Option>
                        <Select.Option value="progress">
                          IN PROGRESS
                        </Select.Option>
                        <Select.Option value="done">DONE</Select.Option>
                      </Select>
                    </Space>
                  </Col>

                  {/* Assignees */}
                  <Col span={12}>
                    <Space align="center">
                      <UserOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Assignees
                      </Text>
                      <Form.Item name="assignees" style={{ margin: 0 }}>
                        <Select
                          {...userSelectProps}
                          style={{ minWidth: 120 }}
                          size="small"
                          maxTagCount={2}
                        />
                      </Form.Item>
                    </Space>
                  </Col>

                  {/* Dates */}
                  <Col span={12}>
                    <Space align="center">
                      <CalendarOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Dates
                      </Text>
                      <Form.Item name="startDate" style={{ margin: 0 }}>
                        <Input
                          type="date"
                          size="small"
                          style={{ width: 120 }}
                        />
                      </Form.Item>
                      <Text style={{ color: "#8c8c8c" }}>→</Text>
                      <Form.Item name="endDate" style={{ margin: 0 }}>
                        <Input
                          type="date"
                          size="small"
                          style={{ width: 120 }}
                        />
                      </Form.Item>
                    </Space>
                  </Col>

                  {/* Priority */}
                  <Col span={12}>
                    <Space align="center">
                      <FlagOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Priority
                      </Text>
                      <Form.Item name="priority" style={{ margin: 0 }}>
                        <Select
                          {...prioritySelectProps}
                          style={{ width: 120 }}
                          size="small"
                        />
                      </Form.Item>
                    </Space>
                  </Col>

                  {/* Time Estimate */}
                  <Col span={12}>
                    <Space align="center">
                      <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Time Estimate
                      </Text>
                      <Form.Item name="estimate" style={{ margin: 0 }}>
                        <Input
                          placeholder="Ước lượng (giờ)"
                          size="small"
                          style={{ width: 120 }}
                        />
                      </Form.Item>
                    </Space>
                  </Col>

                  {/* Semester */}
                  <Col span={12}>
                    <Space align="center">
                      <CalendarOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Kỳ học
                      </Text>
                      <Form.Item name="semester" style={{ margin: 0 }}>
                        <Select
                          placeholder="Chọn kỳ học"
                          {...semesterSelectProps}
                          style={{ width: 150 }}
                          size="small"
                        />
                      </Form.Item>
                    </Space>
                  </Col>

                  {/* Link */}
                  <Col span={24}>
                    <Space align="center" style={{ width: "100%" }}>
                      <LinkOutlined style={{ color: "#8c8c8c" }} />
                      <Text strong style={{ minWidth: 80 }}>
                        Tài liệu
                      </Text>
                      <Form.Item name="link" style={{ margin: 0, flex: 1 }}>
                        <Input
                          placeholder="https://example.com/tailieu"
                          size="small"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Space>
                  </Col>
                </Row>
              </div>
            </div>

            <Divider />

            <div
              style={{
                width: "100%",
                display: "flex",
                gap: "5px",
              }}
            >
              {/* Description */}
              <div
                style={{
                  marginBottom: 24,
                  flex: 3,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <MessageOutlined style={{ color: "#8c8c8c" }} />
                  <Text strong>Mô tả chi tiết</Text>
                </div>
                <Form.Item name="description" rules={[{ required: true }]}>
                  <Input.TextArea
                    rows={4}
                    placeholder="Thêm mô tả cho công việc..."
                    style={{
                      resize: "none",
                      minHeight: 140,
                    }}
                  />
                </Form.Item>
              </div>

              {/* File Upload */}
              <div
                style={{
                  marginBottom: 24,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    gap: 8,
                  }}
                >
                  <UploadOutlined style={{ color: "#8c8c8c" }} />
                  <Text strong>File đính kèm</Text>
                </div>
                <Form.Item
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
                    <div
                      style={{
                        border: "2px dashed #d9d9d9",
                        borderRadius: 8,
                        padding: 24,
                        textAlign: "center",
                        background: "#fafafa",
                      }}
                    >
                      <UploadOutlined
                        style={{
                          fontSize: 24,
                          color: "#8c8c8c",
                          marginBottom: 8,
                        }}
                      />
                      <div>
                        <Text>Kéo thả file hoặc </Text>
                        <Button type="link" style={{ padding: 0 }}>
                          chọn file
                        </Button>
                      </div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            {/* Subtasks */}
            <div
              style={{
                padding: "14px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 8,
              }}
            >
              <Form.List name="subtasks">
                {(fields, { add, remove }) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Title level={4} style={{ margin: 0 }}>
                          Subtasks
                        </Title>
                        <div
                          style={{
                            background: "#f0f0f0",
                            borderRadius: 12,
                            padding: "2px 8px",
                            fontSize: 12,
                            color: "#8c8c8c",
                          }}
                        >
                          {fields.length}
                        </div>
                      </div>
                    </div>

                    {/* Table Header */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 150px 120px 120px 40px",
                        gap: 16,
                        padding: "8px 12px",
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        Name
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        Assignee
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        Priority
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, fontWeight: 500 }}
                      >
                        Due date
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() =>
                          add({
                            title: "",
                            assignee: null,
                            startDate: "",
                            endDate: "",
                            priority: "medium",
                          })
                        }
                        style={{ width: 24, height: 24, minWidth: 24 }}
                      />
                    </div>

                    {/* Subtask Rows */}
                    <div
                      style={{
                        minHeight: fields.length === 0 ? 60 : "auto",
                      }}
                    >
                      {fields.map(({ key, name }, index) => (
                        <div
                          key={key}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 150px 120px 120px 40px",
                            gap: 16,
                            padding: "8px 12px",
                            alignItems: "center",
                            borderRadius: 4,
                            marginBottom: 4,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fafafa";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          {/* Task Name */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                border: "2px solid #d9d9d9",
                                borderRadius: "50%",
                                flexShrink: 0,
                              }}
                            />
                            <Form.Item
                              name={[name, "title"]}
                              style={{ margin: 0, flex: 1 }}
                            >
                              <Input
                                placeholder="Task name"
                                style={{ padding: "0 0 0 5px", fontSize: 14 }}
                              />
                            </Form.Item>
                          </div>

                          {/* Assignee */}
                          <Form.Item
                            name={[name, "assignee"]}
                            style={{ margin: 0 }}
                          >
                            <Select
                              placeholder=""
                              suffixIcon={
                                <UserOutlined style={{ color: "#8c8c8c" }} />
                              }
                              style={{
                                width: "100%",
                              }}
                              size="small"
                              showSearch
                              onSearch={debounceFetcher}
                              filterOption={false}
                              options={assigneeOptions.map((user) => ({
                                label: `${user.name} (${user.email})`,
                                value: user.email,
                              }))}
                            />
                          </Form.Item>

                          {/* Priority */}
                          <Form.Item
                            name={[name, "priority"]}
                            style={{ margin: 0 }}
                          >
                            <Select
                              placeholder=""
                              suffixIcon={
                                <FlagOutlined style={{ color: "#8c8c8c" }} />
                              }
                              style={{
                                width: "100%",
                              }}
                              size="small"
                              options={[
                                { label: "Thấp", value: "low" },
                                { label: "Trung bình", value: "medium" },
                                { label: "Cao", value: "high" },
                              ]}
                            />
                          </Form.Item>

                          {/* Due Date */}
                          <Form.Item
                            name={[name, "endDate"]}
                            style={{
                              margin: 0,
                            }}
                          >
                            <Input
                              type="date"
                              style={{
                                width: "100%",
                              }}
                              size="small"
                              // suffix={
                              //   <CalendarOutlined
                              //     style={{ color: "#8c8c8c" }}
                              //   />
                              // }
                            />
                          </Form.Item>

                          {/* Delete Button */}
                          <Button
                            type="text"
                            size="small"
                            icon={<CloseOutlined />}
                            onClick={() => remove(name)}
                            style={{
                              width: 24,
                              height: 24,
                              minWidth: 24,
                              color: "#ff4d4f",
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Add Task Button */}
                    {fields.length === 0 && (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#8c8c8c",
                        }}
                      >
                        <Text type="secondary">No subtasks added yet</Text>
                      </div>
                    )}
                  </>
                )}
              </Form.List>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                textAlign: "right",
                paddingTop: 16,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Space>
                <Button
                  onClick={() => {
                    close();
                    list("tasks", "replace");
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Tạo công việc
                </Button>
              </Space>
            </div>
          </Form>
        </Content>

        {/* Activity Sidebar */}
        <Sider
          width={320}
          style={{ background: "#fafafa", borderLeft: "1px solid #f0f0f0" }}
        >
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Activity
              </Title>
              <Space>
                <Button size="small" type="text">
                  <MessageOutlined /> 1
                </Button>
                <Button size="small" type="text">
                  Show more
                </Button>
              </Space>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Space align="start">
                <Avatar size="small" style={{ backgroundColor: "#87d068" }}>
                  QB
                </Avatar>
                <div>
                  <Text style={{ fontSize: 12 }}>
                    <Text strong>Quyền Bùi</Text> created subtask: new 0
                  </Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Jul 5 at 11:11 am
                    </Text>
                  </div>
                </div>
              </Space>
            </div>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Custom Fields</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                No custom fields added yet.
              </Text>
            </div>

            <div>
              <Input.TextArea
                placeholder="Write a comment..."
                rows={3}
                style={{ marginBottom: 12, resize: "none" }}
              />
              <div style={{ textAlign: "right" }}>
                <Button type="primary" size="small">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Sider>
      </Layout>
    </Modal>
  );
};

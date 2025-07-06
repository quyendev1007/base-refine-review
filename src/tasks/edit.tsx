import { useModalForm } from "@refinedev/antd";
import { HttpError, useList, useNavigation } from "@refinedev/core";

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
} from "antd";
import { useEffect, useMemo, useState } from "react";
import type { SelectProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";

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

  const { data: semesters, isLoading: isLoadingStages } = useList<
    ISemester,
    HttpError
  >({
    resource: "semesters",
  });
  console.log("semesters", semesters);

  const [defaultSemesterId, setDefaultSemesterId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (!semesters?.data) return;

    const now = new Date();
    const current = semesters.data.find((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return now >= start && now <= end;
    });

    setDefaultSemesterId(current?.id);
  }, [semesters]);

  const semesterSelectProps = useMemo(() => {
    return {
      options:
        semesters?.data.map((s) => {
          const year = new Date(s.startDate).getFullYear();
          return {
            label: `${s.name} ${year}`,
            value: s.id,
          };
        }) || [],
    };
  }, [semesters]);

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
            name="semesterId"
            initialValue={
              formProps?.initialValues?.semesterId ?? defaultSemesterId
            }
            rules={[{ required: true }]}
          >
            <Select
              loading={isLoadingStages}
              placeholder="Chọn kỳ học"
              {...semesterSelectProps}
            />
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
      </Form>
    </Modal>
  );
};

import React from "react";
import { Show } from "@refinedev/antd";

import { Descriptions, Switch } from "antd";
import { useShow } from "@refinedev/core";

export const LecturerShow: React.FC = () => {
    const { queryResult } = useShow();
    const record = queryResult?.data?.data;

    return (
        <Show>
            <Descriptions title="Thông tin giảng viên" bordered column={1}>
                <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
                <Descriptions.Item label="Tên">{record?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{record?.phone}</Descriptions.Item>
                <Descriptions.Item label="Loại người dùng">{record?.user_type}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">{record?.role}</Descriptions.Item>
                <Descriptions.Item label="Kích hoạt">
                    <Switch checked={record?.isActive} disabled />
                </Descriptions.Item>
            </Descriptions>
        </Show>
    );
};

export default LecturerShow; 
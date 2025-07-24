import React from "react";
import { Show,  } from "@refinedev/antd";
import { Descriptions } from "antd";
import { useShow } from "@refinedev/core";

export const UserShow: React.FC = () => {
    const { queryResult } = useShow({ resource: "users" });
    const record = queryResult?.data?.data;
    return (
        <Show>
            <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="ID">{record?.id}</Descriptions.Item>
                <Descriptions.Item label="Tên">{record?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{record?.email}</Descriptions.Item>
                <Descriptions.Item label="Vai trò">{record?.role}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">{record?.isActive ? "Hoạt động" : "Ngừng"}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{record?.phone}</Descriptions.Item>
            </Descriptions>
        </Show>
    );
};

export default UserShow;

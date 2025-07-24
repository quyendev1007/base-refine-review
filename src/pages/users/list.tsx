import React from "react";
import { List, useTable, EditButton, DeleteButton } from "@refinedev/antd";
import { Table } from "antd";

interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
    phone?: string;
}

export const UserList: React.FC = () => {
    // Lấy user từ localStorage
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    let role = null;
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            role = user.role;
        } catch (e) {
            role = null;
        }
    }

    if (role !== "CNBM") {
        return (
            <div style={{ padding: 24, textAlign: "center", color: "#d4380d", fontWeight: 500 }}>
                Bạn không có quyền truy cập chức năng này.
            </div>
        );
    }

    const { tableProps } = useTable<IUser>({ resource: "users" });

    return (
        <List>
            <Table
                {...tableProps}
                rowKey="id"
                columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                    },
                    {
                        title: "Tên",
                        dataIndex: "name",
                    },
                    {
                        title: "Email",
                        dataIndex: "email",
                    },
                    {
                        title: "Vai trò",
                        dataIndex: "role",
                    },
                    {
                        title: "Trạng thái",
                        dataIndex: "isActive",
                        render: (value: boolean) => value ? "Hoạt động" : "Ngừng",
                    },
                    {
                        title: "Số điện thoại",
                        dataIndex: "phone",
                    },
                    {
                        title: "Actions",
                        dataIndex: "actions",
                        render: (_: any, record: IUser) => (
                            <div style={{ display: "flex", gap: 8 }}>
                                <EditButton recordItemId={record.id} />
                                <DeleteButton recordItemId={record.id} />
                            </div>
                        ),
                    },
                ]}
            />
        </List>
    );
};

export default UserList;

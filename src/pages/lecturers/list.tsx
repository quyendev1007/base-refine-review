import React from "react";
import { List, useTable, EditButton, DeleteButton, ShowButton } from "@refinedev/antd";
import { Table } from "antd";

interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    phone: string;
}

export const UserList: React.FC = () => {
    const { tableProps } = useTable<IUser>({ resource: "users" });

    return (
        <List title="Danh sách người dùng (mọi vai trò)">
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
                        title: "Số điện thoại",
                        dataIndex: "phone",
                    },
                    {
                        title: "Vai trò",
                        dataIndex: "role",
                    },
                    {
                        title: "Kích hoạt",
                        dataIndex: "isActive",
                        render: (isActive: boolean) => (isActive ? "Có" : "Không"),
                    },
                    {
                        title: "Actions",
                        dataIndex: "actions",
                        render: (_: any, record: IUser) => (
                            <div style={{ display: "flex", gap: 8 }}>
                                <ShowButton recordItemId={record.id} />
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

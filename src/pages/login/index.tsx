
import React from "react";
import { useLogin } from "@refinedev/core"; 
import { Button, Form, Input, Divider } from "antd"; 
export const LoginPage: React.FC = () => {
    // Lấy hook useLogin từ Refine.
    // 'mutate' là hàm để kích hoạt quá trình login.
    // 'isLoading' là trạng thái boolean cho biết quá trình login đang diễn ra.
    const { mutate: login, isLoading } = useLogin();
    const handleGoogleLogin = () => {
        login({ providerName: "google" });
    };

    const onFinish = (values: { email: string; password: string }) => {
        login(values);
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f0f2f5" 
        }}>
            <div style={{
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "center",
                width: 380, 
                backgroundColor: "#fff", 
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" 
            }}>
                <h2 style={{ marginBottom: "24px", color: "#333" }}>Sign in to your account</h2>
                <Button
                    type="primary"
                    onClick={handleGoogleLogin}
                    style={{ marginBottom: 16 }}
                    block
                    loading={isLoading} 
                >
                    Sign in with Google
                </Button>
                <Divider style={{ margin: "24px 0", borderColor: "#eee" }}>Hoặc đăng nhập bằng tài khoản</Divider>
                <Form
                    layout="vertical" 
                    onFinish={onFinish} 
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập Email của bạn!" }, 
                            { type: "email", message: "Email không hợp lệ!" } 
                        ]}
                    >
                        {/* Input không cần thuộc tính 'name' ở đây vì Form.Item đã có */}
                        <Input size="large" placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập Mật khẩu của bạn!" } 
                        ]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}> 
                        <Button
                            type="primary"
                            htmlType="submit" 
                            block 
                            loading={isLoading} 
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import { message } from "antd";

export const TOKEN_KEY = "accessToken";
const BE_BASE_URL = import.meta.env.VITE_BE_API_URL || "http://localhost:3000";

const FAKE_USERS = [
    { email: "cnbm1@gmail.com", password: "123456", role: "CNBM", name: "CNBM User", id: "10" },
    { email: "gv1@gmail.com", password: "123456", role: "GV", name: "GV User", id: "11" },
];

export const authProvider: AuthProvider = {
    login: async ({ email, password, providerName }) => {
        if (providerName === "google") {
            window.location.href = `${BE_BASE_URL}/api/auth/google`;
            return {
                success: true, 
            };
        }

        //Login fake data
        if (email && password) {
            const user = FAKE_USERS.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem(TOKEN_KEY, "fake-account-token-" + user.role);
                localStorage.setItem("user", JSON.stringify(user));
                message.success("Đăng nhập thành công!");
                return {
                    success: true,
                    redirectTo: "/",
                };
            } else {
                return {
                    success: false,
                    error: {
                        name: "LoginError",
                        message: "Sai email hoặc mật khẩu!",
                    },
                };
            }
        }

   
        return {
            success: false,
            error: {
                name: "LoginError",
                message: "Vui lòng thử lại",
            },
        };
    },

    logout: async () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("user");
        // Refine sẽ tự động điều hướng đến redirectTo khi logout thành công
        return {
            success: true,
            redirectTo: "/login",
        };
    },

    check: async () => {
        const token = localStorage.getItem(TOKEN_KEY);

        // --- BƯỚC 1: Xử lý trường hợp người dùng đã có token trong localStorage ---
        if (token) {
            // Kiểm tra nếu đây là một "fake token" từ đăng nhập tài khoản fake
            if (token.startsWith("fake-account-token-")) {
                const user = localStorage.getItem("user");
                if (user) {
                    try {
                        // Đảm bảo thông tin user cũng hợp lệ nếu có
                        JSON.parse(user);
                        return { authenticated: true };
                    } catch (e) {
                        console.error("Invalid user data in localStorage for fake token:", e);
                        localStorage.removeItem(TOKEN_KEY);
                        localStorage.removeItem("user");
                        return {
                            authenticated: false,
                            redirectTo: "/login",
                        };
                    }
                }
                return { authenticated: true }; // Giả định là authenticated nếu có fake token và không có user data
            }

           
            try {
                await axios.get(`${BE_BASE_URL}/api/auth/admin/test`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
                return { authenticated: true }; 
            } catch (error) {
                console.error("Token validation failed with BE:", error);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem("user");
                message.error("Xác thực token thất bại hoặc Backend không thể truy cập. Vui lòng thử đăng nhập lại.");
                return {
                    authenticated: false,
                    redirectTo: "/login",
                    error: {
                        name: "BackendAuthError",
                        message: "Authentication token invalid or backend unreachable.",
                    },
                };
            }
        }

        // --- BƯỚC 2: Xử lý trường hợp sau khi BE redirect về với token trong URL (cho Google OAuth thật) ---
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem(TOKEN_KEY, tokenFromUrl);
            // Xóa token khỏi URL sau khi lưu vào localStorage để tăng cường bảo mật
            window.history.replaceState({}, document.title, window.location.pathname);

            // lấy thông tin người dùng từ BE nếu có token thật từ URL
            try {
                const userResponse = await axios.get(`${BE_BASE_URL}/api/user/me`, { // Endpoint cần được bảo vệ bằng JWT
                    headers: { Authorization: `Bearer ${tokenFromUrl}` }
                });
                localStorage.setItem("user", JSON.stringify(userResponse.data));
                message.success("Đăng nhập thành công từ URL!");
                return {
                    authenticated: true,
                    redirectTo: "/",
                };
            } catch (error) {
                console.error("Failed to fetch user identity after login from URL:", error);
                message.error("Không thể lấy thông tin người dùng sau khi đăng nhập. Vui lòng thử lại.");
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem("user");
                return {
                    authenticated: false,
                    redirectTo: "/login",
                    error: {
                        name: "UserFetchError",
                        message: "Failed to retrieve user information after login.",
                    },
                };
            }
        }

        //Nếu không có token trong localStorage và cũng không có trong URL
        return {
            authenticated: false,
            redirectTo: "/login",
        };
    },

    getPermissions: async () => {
        const user = localStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.role; // Trả về role của người dùng fake hoặc thật
        }
        return undefined;
    },

    getIdentity: async () => {
        const user = localStorage.getItem("user");
        if (user) {
            try {
                return JSON.parse(user);
            } catch (error) {
                console.error("Failed to parse user from localStorage in getIdentity:", error);
                return null;
            }
        }
        return null;
    },

    onError: async (error: any) => {
        console.error("Auth Provider Error:", error);
        if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
             message.error("Lỗi kết nối đến Backend. Vui lòng kiểm tra lại kết nối hoặc trạng thái của Backend.");
        } else if (error.response?.data?.message) { 
            message.error(`Lỗi xác thực: ${error.response.data.message}`);
        } else if (error.message) {
            message.error(`Lỗi xác thực: ${error.message}`);
        } else {
            message.error("Đã xảy ra lỗi xác thực không xác định.");
        }

        // Nếu lỗi là 401 Unauthorized, yêu cầu logout
        if (error.statusCode === 401 || error.response?.status === 401) {
            return {
                logout: true,
            };
        }
        return { error };
    },
};
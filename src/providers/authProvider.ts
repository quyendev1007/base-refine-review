import type { AuthProvider } from '@refinedev/core'
import { message } from 'antd'
import { axiosInstance } from '../libs/axios'
import axios from 'axios'

const BE_BASE_URL =
  import.meta.env.VITE_BE_API_URL || 'http://localhost:4000/api'

export const authProvider: AuthProvider = {
  login: async ({ providerName }) => {
    if (providerName === 'google') {
      window.location.href = `${BE_BASE_URL}/auth/google`
      return { success: true }
    }
    return {
      success: false,
      error: {
        name: 'LoginError',
        message: 'Chỉ hỗ trợ đăng nhập với Google'
      }
    }
  },

  logout: async () => {
    try {
      await axiosInstance.delete('/auth/logout')
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('user')
    return {
      success: true,
      redirectTo: '/login'
    }
  },

  check: async () => {
    try {
      const res = await axiosInstance.get('/auth/me')
      localStorage.setItem('user', JSON.stringify(res.data))
      return { authenticated: true }
    } catch (error) {
      localStorage.removeItem('user')
      return {
        authenticated: false,
        redirectTo: '/login'
      }
    }
  },

  getPermissions: async () => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        return JSON.parse(user).role
      } catch {
        return undefined
      }
    }
    return undefined
  },

  getIdentity: async () => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        return JSON.parse(user)
      } catch {
        return null
      }
    }
    return null
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: async (error: any) => {
    if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
      message.error(
        'Lỗi kết nối đến Backend. Vui lòng kiểm tra lại kết nối hoặc trạng thái của Backend.'
      )
    } else if (error.response?.data?.message) {
      message.error(`Lỗi xác thực: ${error.response.data.message}`)
    } else if (error.message) {
      message.error(`Lỗi xác thực: ${error.message}`)
    } else {
      message.error('Đã xảy ra lỗi xác thực không xác định.')
    }
    if (error.statusCode === 401 || error.response?.status === 401) {
      return { logout: true }
    }
    return { error }
  }
}

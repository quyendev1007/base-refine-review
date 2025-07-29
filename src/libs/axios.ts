import axios from 'axios'

const BE_BASE_URL =
  import.meta.env.VITE_BE_API_URL || 'http://localhost:4000/api'

export const axiosInstance = axios.create({
  baseURL: BE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

import { message } from 'antd'

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.code === 'ERR_NETWORK') {
      message.error('Không thể kết nối tới server.')
    }
    return Promise.reject(error)
  }
)

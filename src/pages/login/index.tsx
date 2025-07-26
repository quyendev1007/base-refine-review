import React from 'react'
import { useLogin } from '@refinedev/core'
import { Button, Typography, Card, Space } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  const { mutate: login, isPending } = useLogin()

  const handleGoogleLogin = () => {
    login({ providerName: 'google' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #e6eafc 100%)'
      }}>
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          textAlign: 'center',
          padding: '40px 32px'
        }}
        bordered={false}>
        <Space direction='vertical' size={24} style={{ width: '100%' }}>
          <img
            src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg'
            alt='Google'
            width={56}
            style={{ marginBottom: 8 }}
          />
          <Title level={3} style={{ marginBottom: 0 }}>
            Đăng nhập với Google
          </Title>
          <Text type='secondary'>
            Vui lòng sử dụng tài khoản Google của bạn để tiếp tục.
          </Text>
          <Button
            type='primary'
            icon={<GoogleOutlined />}
            size='large'
            block
            style={{
              background: 'linear-gradient(90deg, #4285F4 0%, #34A853 100%)',
              border: 'none',
              fontWeight: 500,
              letterSpacing: 0.5
            }}
            onClick={handleGoogleLogin}
            loading={isPending}>
            Đăng nhập với Google
          </Button>
        </Space>
      </Card>
    </div>
  )
}

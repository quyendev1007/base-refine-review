import { Refine, Authenticated } from '@refinedev/core'
import { DevtoolsPanel, DevtoolsProvider } from '@refinedev/devtools'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'

import {
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2
} from '@refinedev/antd'
import '@refinedev/antd/dist/reset.css'

import { dataProvider } from '@/providers/dataProvider'
import { App as AntdApp } from 'antd'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router'
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler
} from '@refinedev/react-router'
import { ColorModeContextProvider } from './contexts/color-mode'
import { Header } from './components/header'
import { LoginPage } from './pages/login'
import { Register } from './pages/register'
import { ForgotPassword } from './pages/forgotPassword'
import { authProvider } from './providers/authProvider'
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow
} from './pages/products'
import { ProductOutlined, UserOutlined } from '@ant-design/icons'
import TasksListPage from './tasks'
import { TasksCreatePage } from './tasks/create'
import { TasksEditPage } from './tasks/edit'
import UserList from './pages/users/list'
import UserCreate from './pages/users/create'
import UserEdit from './pages/users/edit'
import UserShow from './pages/users/show'

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider(
                  import.meta.env.VITE_BE_API_URL || 'http://localhost:4000/api'
                )}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                resources={[
                  {
                    name: 'users',
                    list: '/users',
                    edit: '/users/edit/:id',
                    meta: {
                      // canDelete: true,
                      icon: <UserOutlined />
                    }
                  },
                  {
                    name: 'products',
                    list: '/products',
                    create: '/products/create',
                    edit: '/products/edit/:id',
                    show: '/products/show/:id',
                    meta: {
                      canDelete: true,
                      icon: <ProductOutlined />
                    }
                  },
                  {
                    name: 'tasks',
                    list: '/tasks',
                    create: '/tasks/new',
                    edit: '/tasks/edit/:id',
                    show: '/tasks/show/:id',
                    meta: {
                      canDelete: true,
                      icon: <ProductOutlined />
                    }
                  },
                  {
                    name: 'users',
                    list: '/users',
                    create: '/users/create',
                    edit: '/users/edit/:id',
                    show: '/users/show/:id',
                    meta: {
                      canDelete: true,
                      icon: <ProductOutlined />
                    }
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: 'eA9seV-MdQw4Z-qzamgL'
                }}>
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key='authenticated-inner'
                        fallback={<CatchAllNavigate to='/login' />}>
                        <ThemedLayoutV2
                          Header={Header}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}>
                          <Outlet />
                        </ThemedLayoutV2>
                        //{' '}
                      </Authenticated>
                    }>
                    <Route
                      index
                      element={<NavigateToResource resource='tasks' />}
                    />
                    <Route path='/users'>
                      <Route index element={<UserList />} />
                      <Route path='edit/:id' element={<UserEdit />} />
                    </Route>
                    <Route path='/products'>
                      <Route index element={<ProductList />} />
                      <Route path='create' element={<ProductCreate />} />
                      <Route path='edit/:id' element={<ProductEdit />} />
                      <Route path='show/:id' element={<ProductShow />} />
                    </Route>
                    <Route path='/tasks'>
                      <Route index element={<TasksListPage />} />
                      <Route path='new' element={<TasksCreatePage />} />
                      <Route path='edit/:id' element={<TasksEditPage />} />
                      {/*

                      <Route path="show/:id" element={<TaskShow />} /> */}
                    </Route>
                    <Route path='/users'>
                      <Route index element={<UserList />} />
                      <Route path='create' element={<UserCreate />} />
                      <Route path='edit/:id' element={<UserEdit />} />
                      <Route path='show/:id' element={<UserShow />} />
                    </Route>
                    <Route path='*' element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key='authenticated-outer'
                        fallback={<Outlet />}>
                        <NavigateToResource />
                        //{' '}
                      </Authenticated>
                    }>
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<Register />} />
                    <Route
                      path='/forgot-password'
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  )
}

export default App

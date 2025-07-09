import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom';
import App from './App.jsx';
import './styles/datepicker.css'; // Import the new CSS file
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ClassSelection from './pages/teachers/ClassSelection.jsx';
import TaskSelection from './pages/teachers/TaskSelection.jsx';
import CheckTodo from './pages/teachers/CheckTodo.jsx';
import SendReport from '././pages/teachers/SendReport.jsx';
import CheckEquipment from './pages/teachers/CheckEquipment.jsx';
import AdminTasks from './pages/admin/TaskSelection.jsx';
import AdminClasses from './pages/admin/Classes.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminTeachers from './pages/admin/Teachers.jsx';
import AdminEquipment from './pages/admin/Equipment.jsx';
import { setAuthToken } from './api/admin'; // ✅ 토큰 등록 함수 import

const token = localStorage.getItem('accessToken');
if (token) {
  setAuthToken(token); // ✅ 앱 시작 시 axios에 토큰 설정
}

const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });

import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (() => {
          const LoginPage = pages['./pages/index.jsx'].default;
          return <LoginPage />;
        })(),
        loader: () => {
          const accessToken = localStorage.getItem('accessToken');
          const user = localStorage.getItem('user');
          if (accessToken && user) {
            try {
              const parsedUser = JSON.parse(user);
              if (parsedUser.position === 'Administrator') {
                return redirect('/admin/tasks');
              } else if (parsedUser.position === 'Instructor') {
                return redirect('/teacher/classes');
              }
            } catch (e) {
              console.error("Failed to parse user data from localStorage", e);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
            }
          }
          return null; // Stay on login page
        },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/teacher/classes',
            element: <ClassSelection />,
          },
          {
            path: '/teacher/class/:classId/tasks',
            element: <TaskSelection />,
          },
          {
            path: '/teacher/class/:classId/tasks/check-todo',
            element: <CheckTodo />,
          },
          {
            path: '/teacher/class/:classId/tasks/send-report',
            element: <SendReport />,
          },
          {
            path: '/teacher/class/:classId/tasks/check-equipment',
            element: <CheckEquipment />,
          },
          {
            path: '/admin/tasks',
            element: <AdminTasks />,
          },
          {
            path: '/admin/classes',
            element: <AdminClasses />,
          },
          {
            path: '/admin/students',
            element: <AdminStudents />,
          },
          {
            path: '/admin/teachers',
            element: <AdminTeachers />,
          },
          {
            path: '/admin/equipment',
            element: <AdminEquipment />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
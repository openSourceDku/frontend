import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import ClassSelection from './pages/teachers/ClassSelection.jsx';
import TaskSelection from './pages/teachers/TaskSelection.jsx';
import CheckTodo from './pages/teachers/CheckTodo.jsx';
import SendReport from './pages/teachers/SendReport.jsx';
import CheckEquipment from './pages/teachers/CheckEquipment.jsx';
import AdminTasks from './pages/admin/TaskSelection.jsx';
import AdminClasses from './pages/admin/Classes.jsx';
import AdminStudents from './pages/admin/Students.jsx';
import AdminTeachers from './pages/admin/Teachers.jsx';
import AdminEquipment from './pages/admin/Equipment.jsx';

const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });

import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: Object.keys(pages).map((path) => {
      const Page = pages[path].default;
      const pathName = path
        .replace('./pages/', '')
        .replace('.jsx', '')
        .toLowerCase();

      if (pathName === 'index') {
        return {
          index: true,
          element: <Page />,
        };
      }

      return {
        path: pathName,
        element: <Page />,
      };
    }),
  },
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
  {
    path: '*',
    element: <NotFound />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (accessToken && user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser.position === 'Administrator') {
          navigate('/admin/tasks');
        } else if (parsedUser.position === 'Instructor') {
          navigate('/teacher/classes');
        } else {
          // Fallback for unknown roles, or if position is missing
          navigate('/admin/tasks'); // Default to admin tasks if role is unclear
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        // If user data is corrupted, clear storage and stay on login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return <Login />;
}

export default HomePage;

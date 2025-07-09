import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/'); // Redirect to login page if not authenticated
    }
  }, [accessToken, navigate]);

  // If authenticated, render the child routes
  return accessToken ? <Outlet /> : null;
};

export default ProtectedRoute;

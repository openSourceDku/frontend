import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error.message);
      // Even if API call fails, force logout on client-side
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const handleGoHome = () => {
    if (user) {
      if (user.position === 'Administrator') {
        navigate('/admin/tasks');
      } else if (user.position === 'Instructor') {
        navigate('/teacher/classes');
      } else {
        navigate('/'); // Fallback for unknown roles
      }
    } else {
      navigate('/'); // If not logged in, go to login page
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6'
    }}>
      <button onClick={handleGoHome} style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        Home
      </button>
      {user && (
        <div>
          <span style={{ marginRight: '15px' }}>{user.name}님 환영합니다!</span>
          <button onClick={handleLogout} style={{
            padding: '8px 12px',
            border: '1px solid #dc3545',
            borderRadius: '4px',
            backgroundColor: '#dc3545',
            color: 'white',
            cursor: 'pointer'
          }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

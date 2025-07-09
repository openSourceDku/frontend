import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const role = isAdmin ? 'admin' : 'teacher';
    try {
      const response = await login(username, password, role);
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      localStorage.setItem('user', JSON.stringify(response.user));

      if (role === 'admin') {
        navigate('/admin/tasks');
      } else {
        navigate('/teacher/classes');
      }
    } catch (error) {
      alert('Login failed: ' + error.detail || error.message);
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <input type="checkbox" id="adminCheck" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} style={{ marginRight: '10px' }} />
          <label htmlFor="adminCheck">Admin Mode</label>
        </div>
        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '4px', backgroundColor: '#1877f2', color: '#fff', cursor: 'pointer' }}>Login</button>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, we're simulating a successful login.
    // In a real application, you would perform authentication here.

    // Uncomment the following lines to add actual authentication logic:
    /*
    const username = ""; // Get username from input
    const password = ""; // Get password from input

    if (isAdmin) {
      // Call admin login API
      // try {
      //   const response = await adminLogin(username, password);
      //   if (response.success) {
      //     navigate('/admin/task-selection');
      //   } else {
      //     alert('Admin login failed.');
      //   }
      // } catch (error) {
      //   console.error('Admin login error:', error);
      //   alert('An error occurred during admin login.');
      // }
    } else {
      // Call regular user login API
      // try {
      //   const response = await userLogin(username, password);
      //   if (response.success) {
      //     navigate('/teacher/class-selection'); // Or wherever regular users go
      //   } else {
      //     alert('Login failed.');
      //   }
      // } catch (error) {
      //   console.error('Login error:', error);
      //   alert('An error occurred during login.');
      // }
    }
    */

    // Simulate successful login for demonstration
    if (isAdmin) {
      console.log('Simulating admin login success. Navigating to admin task selection.');
      navigate('/admin/tasks');
    } else {
      console.log('Simulating user login success. Navigating to teacher class selection.');
      navigate('/teacher/classes'); // Assuming this is the default for non-admin
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        <input type="email" placeholder="Email" style={{ width: '100%', marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
        <input type="password" placeholder="Password" style={{ width: '100%', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
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
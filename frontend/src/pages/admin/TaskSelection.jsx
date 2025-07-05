import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminTasks() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px',textAlign:'center ',margin: '0 auto' }}>
      <h1>관리자 작업 선택</h1>
      <p>관리자 작업을 선택하세요:</p>
      <div style={{ display: 'flex', flexDirection: 'column', textAlign:'center ',gap: '10px', marginTop: '20px' }}>
        <button style={styles.button} onClick={() => handleNavigation('/admin/equipment')}>비품 관리</button>
        <button style={styles.button} onClick={() => handleNavigation('/admin/classes')}>반 관리</button>
        <button style={styles.button} onClick={() => handleNavigation('/admin/students')}>학생 관리</button>
        <button style={styles.button} onClick={() => handleNavigation('/admin/teachers')}>선생 관리</button>
      </div>
    </div>
  );
}

const styles = {
  button: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      borderColor: '#999999',
    },
  },
};

export default AdminTasks;

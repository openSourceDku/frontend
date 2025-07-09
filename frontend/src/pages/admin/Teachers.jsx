import React, { useState, useEffect } from 'react';
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from '../../api/admin';
import TeacherFormModal from '../../components/admin/TeacherFormModal';

function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = () => {
    getTeachers().then(response => {
      setTeachers(response.data.teachers);
    });
  }

  const handleSaveTeacher = (teacherData) => { // 여기 수정
    if (teacherData.teacher_id) {
      updateTeacher(teacherData).then(() => {
        loadTeachers();
      });
    } else {
      addTeacher(teacherData).then(() => {
        loadTeachers();
      });
    }
  };
  // const handleSaveTeacher = (teacherData) => {
  //   if (teacherData.id) {
  //     updateTeacher(teacherData).then(() => {
  //       loadTeachers();
  //     });
  //   } else {
  //     addTeacher(teacherData).then(() => {
  //       loadTeachers();
  //     });
  //   }
  // };

  const handleDeleteTeacher = (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      window.confirm(teacherId)
      deleteTeacher(teacherId).then(() => {
        loadTeachers();
      });
    }
  };

  const openModal = (teacher = null) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>선생 관리</h1>
      <button onClick={() => openModal()} style={buttonStyle}>선생 등록</button>
      <TeacherFormModal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTeacher} 
        teacher={selectedTeacher}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Teacher ID</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Age</th>
            <th style={tableHeaderStyle}>Position</th>
            <th style={tableHeaderStyle}>Sex</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(teacher => (
            <tr key={teacher.id}>
              <td style={tableCellStyle}>{teacher.id}</td>
              <td style={tableCellStyle}>{teacher.teacher_id}</td>
              <td style={tableCellStyle}>{teacher.teacher_name}</td>
              <td style={tableCellStyle}>{teacher.age}</td>
              <td style={tableCellStyle}>{teacher.position}</td>
              <td style={tableCellStyle}>{teacher.sex}</td>
              <td style={tableCellStyle}>
                <button onClick={() => openModal(teacher)} style={editButtonStyle}>수정</button>
                <button onClick={() => handleDeleteTeacher(teacher.teacher_id)} style={deleteButtonStyle}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const buttonStyle = {
  padding: '8px 12px',
  cursor: 'pointer',
  marginBottom: '20px'
};

const editButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: '#008CBA',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  marginRight: '5px'
};

const deleteButtonStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
};

export default AdminTeachers;

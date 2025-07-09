import React, { useState, useEffect } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../../api/admin';
import StudentFormModal from '../../components/admin/StudentFormModal';

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    getStudents().then(response => {
      setStudents(response.data.students);
    });
  }

  const handleSaveStudent = (studentData) => {
    if (studentData.id) {
      updateStudent(studentData).then(() => {
        loadStudents();
      });
    } else {
      addStudent(studentData).then(() => {
        loadStudents();
      });
    }
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteStudent(studentId).then(() => {
        loadStudents();
      });
    }
  };

  const openModal = (student = null) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>학생 관리</h1>
      <button onClick={() => openModal()} style={buttonStyle}>학생 등록</button>
      <StudentFormModal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveStudent} 
        student={selectedStudent}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Student ID</th>
            <th style={tableHeaderStyle}>Class ID</th>
            <th style={tableHeaderStyle}>Name</th>
            <th style={tableHeaderStyle}>Birth Date</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Gender</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td style={tableCellStyle}>{student.id}</td>
              <td style={tableCellStyle}>{student.class_obj ? student.class_obj.id : 'N/A'}</td>
              <td style={tableCellStyle}>{student.name}</td>
              <td style={tableCellStyle}>{student.birth_date}</td>
              <td style={tableCellStyle}>{student.email}</td>
              <td style={tableCellStyle}>{student.gender}</td>
              <td style={tableCellStyle}>
                <button onClick={() => openModal(student)} style={editButtonStyle}>수정</button>
                <button onClick={() => handleDeleteStudent(student.id)} style={deleteButtonStyle}>삭제</button>
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

export default AdminStudents;

import React, { useState, useEffect } from 'react';

const TeacherFormModal = ({ show, onClose, onSave, teacher }) => {
    const [teacherData, setTeacherData] = useState({
        id: '',
        teacher_id: '',
        passwd: '',
        teacher_name: '',
        age: '',
        position: '',
        sex: ''
    });

    useEffect(() => {
        if (teacher) {
            // When editing, don't pre-fill the password for security reasons.
            setTeacherData({...teacher, passwd: ''});
        } else {
            setTeacherData({
                id: '',
                teacher_id: '',
                passwd: '',
                teacher_name: '',
                age: '',
                position: '',
                sex: ''
            });
        }
    }, [teacher]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        const dataToSave = { ...teacherData };
        if (!dataToSave.id) {
            delete dataToSave.id; // Remove id for new teachers
        }
        dataToSave.age = parseInt(dataToSave.age); // Ensure age is an integer
        onSave(dataToSave);
        onClose(); // Close modal after save
    };

    if (!show) {
        return null;
    }

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>{teacher ? '선생 수정' : '선생 등록'}</h2>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Teacher ID</label>
                    <input 
                        type="text" 
                        name="teacher_id" 
                        value={teacherData.teacher_id} 
                        onChange={handleInputChange} 
                        style={inputStyle}
                        readOnly={!!teacher} // Make read-only when editing
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Password</label>
                    <input 
                        type="password" 
                        name="passwd" 
                        placeholder={teacher ? "Leave blank to keep current password" : ""} 
                        value={teacherData.passwd} 
                        onChange={handleInputChange} 
                        style={inputStyle} 
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Name</label>
                    <input type="text" name="teacher_name" value={teacherData.teacher_name} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Age</label>
                    <input type="number" name="age" value={teacherData.age} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Position</label>
                    <input type="text" name="position" value={teacherData.position} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Sex</label>
                    <select name="sex" value={teacherData.sex} onChange={handleInputChange} style={inputStyle}>
                        <option value="">Select Sex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={handleSubmit} style={saveButtonStyle}>저장</button>
                    <button onClick={onClose} style={cancelButtonStyle}>취소</button>
                </div>
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
};

const inputGroupStyle = {
    marginBottom: '15px',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    gap: '10px',
};

const saveButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const cancelButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#cccccc',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default TeacherFormModal;

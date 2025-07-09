// src/pages/admin/AdminStudents.jsx
import React, { useState, useEffect } from 'react';
import {
  getStudents, addStudent, updateStudent, deleteStudent
} from '../../api/admin';
import StudentFormModal from '../../components/admin/StudentFormModal';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ─── 로드 ─── */
  useEffect(load, []);
  function load() {
    getStudents().then(r => setStudents(r.data.students));
  }

  /* ─── 저장(등록/수정) ─── */
  function onSave(data) {
    // studentId 가 있으면 수정, 없으면 신규
    (data.studentId ? updateStudent(data) : addStudent(data)).then(load);
  }

  /* ─── 삭제 ─── */
  function onDel(id) {
    if (window.confirm('삭제하시겠습니까?'))
      deleteStudent(id).then(load);
  }

  /* ─── 모달 ─── */
  const open = s => { setSelected(s); setShowModal(true); };

  return (
    <div style={{padding:20,maxWidth:1000,margin:'0 auto'}}>
      <h1>학생 관리</h1>
      <button style={btnNew} onClick={()=>open(null)}>학생 등록</button>

      <StudentFormModal
        show={showModal}
        onClose={()=>setShowModal(false)}
        onSave={onSave}
        student={selected}
      />

      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>Student&nbsp;ID</th>
            <th style={th}>Class&nbsp;ID</th>
            <th style={th}>Name</th>
            <th style={th}>Birth&nbsp;Date</th>
            <th style={th}>Email</th>
            <th style={th}>Gender</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s=>(
            <tr key={s.id}>
              <td style={td}>{s.id}</td>
              <td style={td}>{s.class_id ?? 'N/A'}</td>
              <td style={td}>{s.name}</td>
              <td style={td}>{s.birth_date}</td>
              <td style={td}>{s.email}</td>
              <td style={td}>{s.gender}</td>
              <td style={td}>
                <button style={btnEdit} onClick={()=>open(s)}>수정</button>
                <button style={btnDel}  onClick={()=>onDel(s.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── 스타일 ─── */
const tbl={width:'100%',borderCollapse:'collapse',marginTop:20};
const th ={border:'1px solid #ddd',padding:8,background:'#f2f2f2',textAlign:'left'};
const td ={border:'1px solid #ddd',padding:8};
const btnNew={padding:'8px 12px',cursor:'pointer',marginBottom:20};
const btnEdit={padding:'5px 10px',background:'#008CBA',color:'#fff',
               border:'none',borderRadius:3,marginRight:5,cursor:'pointer'};
const btnDel ={...btnEdit,background:'#f44336'};

import React, { useState, useEffect } from 'react';
import {
  getTeachers, addTeacher, updateTeacher, deleteTeacher
} from '../../api/admin';
import TeacherFormModal from '../../components/admin/TeacherFormModal';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  /* 리스트 로드 */
  useEffect(load, []);
  function load() {
    getTeachers().then(r => setTeachers(r.data.teachers));
  }

  /* 저장(등록/수정) */
  function onSave(t) {
    (t.id ? updateTeacher(t) : addTeacher(t)).then(load);
  }

  /* 삭제 */
  function onDel(id) {
    if (window.confirm('삭제하시겠습니까?'))
      deleteTeacher(id).then(load);
  }

  /* 모달 열기 */
  const open = (t=null) => { setSelected(t); setShowModal(true); };

  return (
    <div style={{padding:20,maxWidth:1000,margin:'0 auto'}}>
      <h1>선생 관리</h1>
      <button style={btnNew} onClick={()=>open()}>선생 등록</button>

      <TeacherFormModal
        show={showModal}
        onClose={()=>setShowModal(false)}
        onSave={onSave}
        teacher={selected}
      />

      <table style={tbl}>
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Teacher ID</th>
            <th style={th}>Name</th>
            <th style={th}>Age</th>
            <th style={th}>Position</th>
            <th style={th}>Sex</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t=>(
            <tr key={t.id}>
              <td style={td}>{t.id}</td>
              <td style={td}>{t.teacherId}</td>
              <td style={td}>{t.name}</td>
              <td style={td}>{t.age}</td>
              <td style={td}>{t.position}</td>
              <td style={td}>{t.sex}</td>
              <td style={td}>
                <button style={btnEdit} onClick={()=>open(t)}>수정</button>
                <button style={btnDel}  onClick={()=>onDel(t.id)}>삭제</button>
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
const btnEdit={padding:'5px 10px',background:'#008CBA',color:'#fff',border:'none',borderRadius:3,marginRight:5};
const btnDel ={...btnEdit,background:'#f44336'};

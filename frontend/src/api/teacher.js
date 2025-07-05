export const getTeacherClasses = async () => {
  // Mock data based on the Figma design
  const mockClasses = [
    { id: 1, name: '월수 반' },
    { id: 2, name: '화목 반' },
    { id: 3, name: '특강 반' },
  ];

  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockClasses);
    }, 500);
  });
};

export const getStudentsByClassId = async (classId) => {
  // Mock data for students based on classId
  const mockStudents = {
    1: [
      { studentId: 101, studentName: '김철수' },
      { studentId: 102, studentName: '이영희' },
      { studentId: 103, studentName: '박민수' },
    ],
    2: [
      { studentId: 201, studentName: '최지영' },
      { studentId: 202, studentName: '강현우' },
    ],
    3: [
      { studentId: 301, studentName: '정수진' },
    ],
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ students: mockStudents[classId] || [] });
    }, 500);
  });
};

export const sendReport = async (reportData) => {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  const response = await fetch('/api/teachers/reports', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reportData),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getTodosByClassIdAndMonth = async (classId, year, month) => {
  // Mock data for todos
  const mockTodos = {
    1: { // classId 1
      '2025-07': [
        { todoTitle: "수학 숙제 점검", description: "챕터 5 복습 문제 1–10번", date: "2025-07-10" },
        { todoTitle: "과학 실험 준비물", description: "실험 키트 확인 및 분배", date: "2025-07-15" },
        { todoTitle: "영어 단어 시험", description: "Unit 3 단어 암기", date: "2025-07-10" },
        { todoTitle: "미술 과제 제출", description: "자유 주제 그림", date: "2025-07-22" },
        { todoTitle: "독서록 작성", description: "여름방학 추천 도서 읽고 독서록 제출", date: "2025-07-28" },
      ],
      '2025-08': [
        { todoTitle: "개학 준비", description: "교과서 배부", date: "2025-08-01" },
        { todoTitle: "새 학년 준비물", description: "개인 준비물 확인", date: "2025-08-05" },
      ]
    },
    2: { // classId 2
      '2025-07': [
        { todoTitle: "국어 독후감 제출", description: "지정 도서 독후감", date: "2025-07-05" },
        { todoTitle: "체육대회 준비", description: "팀별 연습", date: "2025-07-18" },
        { todoTitle: "사회 탐구 보고서", description: "지역 사회 문제 조사", date: "2025-07-25" },
      ],
      '2025-09': [
        { todoTitle: "중간고사 대비", description: "전 과목 복습", date: "2025-09-10" },
      ]
    },
    3: { // classId 3
      '2025-07': [
        { todoTitle: "특강 과제 제출", description: "특강 내용 요약", date: "2025-07-03" },
        { todoTitle: "발표 준비", description: "개인별 발표 자료 준비", date: "2025-07-12" },
      ],
      '2025-08': [
        { todoTitle: "수료증 발급", description: "특강 수료증 수령", date: "2025-08-20" },
      ]
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      resolve({ todos: (mockTodos[classId] && mockTodos[classId][monthKey]) || [] });
    }, 500);
  });
};

export const getFixtures = async () => {
  // Mock data for fixtures
  const mockFixtures = [
    { name: "화이트보드 마커", price: 1200, quantity: 15 },
    { name: "칠판 지우개", price: 3000, quantity: 5 },
    { name: "분필", price: 500, quantity: 50 },
    { name: "빔 프로젝터", price: 500000, quantity: 1 },
    { name: "교탁", price: 150000, quantity: 2 },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ fixtures: mockFixtures });
    }, 500);
  });
};

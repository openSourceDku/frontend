## 🧑‍💻 로컬 개발(Hot-Reload)
1) 백엔드
```
cd backend
python -m venv env && . env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```
3) 프런트엔드
```bash
cd frontend
npm i
npm run dev          # http://localhost:5173
React dev 서버가 API 요청을 백엔드에 프록시하려면
frontend/vite.config.js 의 proxy 설정을 확인하세요.
```

## ⚙️ 주요 기술 스택
Layer	Tech
Backend	Django 4 · DRF 3 · JWT(SimpleJWT)
Frontend	React 18 (Vite) · Axios · React-Router

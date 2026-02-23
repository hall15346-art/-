# 📦 팔로우엔 영업 파이프라인 - 파일 다운로드 가이드

## 🗂️ 업로드할 파일 목록

### ✅ 필수 파일 (5개)

1. **index.html** - 메인 HTML 파일
2. **css/style.css** - 스타일 파일
3. **js/app.js** - JavaScript 파일
4. **images/followen-logo.png** - 팔로우엔 로고
5. **README.md** - 설명서 (선택)

---

## 📤 닷홈 FTP 업로드 구조

```
html/  ← 닷홈 FTP의 html 폴더
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── followen-logo.png
```

---

## 🔧 FileZilla 업로드 순서

### 1단계: FTP 접속
- 호스트: ftp.dothome.co.kr
- 사용자명: [닷홈 아이디]
- 비밀번호: [닷홈 비밀번호]
- 포트: 21

### 2단계: html 폴더로 이동
- 우측(원격 사이트)에서 `html` 폴더 더블클릭

### 3단계: 폴더 생성
- 우클릭 → "디렉터리 생성"
- css 폴더 생성
- js 폴더 생성  
- images 폴더 생성

### 4단계: 파일 업로드
- 좌측(로컬 사이트)에서 파일 선택
- 우측(원격 사이트) 해당 폴더로 드래그앤드롭

---

## 🌐 접속 주소

업로드 완료 후:
```
http://[아이디].dothome.co.kr
```

---

## ❓ 문제 해결

### 페이지가 안 뜨는 경우
1. index.html이 html 폴더 바로 아래에 있는지 확인
2. 파일명이 정확히 `index.html`인지 확인 (대소문자 구분)
3. css, js, images 폴더가 제대로 만들어졌는지 확인

### 로고가 안 보이는 경우
- images/followen-logo.png 파일이 제대로 업로드됐는지 확인

---

## 📞 추가 지원

문제가 계속되면 닷홈 고객센터 (1661-0357)로 문의하세요!

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const dd = String(now.getDate()).padStart(2, '0'); // Day of the month
const folderPath = path.join(__dirname, `${yyyy}`, `${mm}`);
const filePath = path.join(folderPath, `${mm}${dd}.md`);

const template = `## 📅 ${yyyy}-${mm}-${dd}

### 📌 오늘 배운 것
- 

### 🧠 느낀 점
- 

### 💻 코드 예시
\`\`\`js
// 코드
\`\`\`

### 🔗 참고 링크
- 
`;

if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
fs.writeFileSync(filePath, template);
console.log(`✅ TIL 파일 생성됨: ${filePath}`);
console.log(`[${new Date().toLocaleString()}] TIL created`);

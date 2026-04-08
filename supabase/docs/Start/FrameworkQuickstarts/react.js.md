# React에서 Supabase 시작하기

[공식문서](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

Supabase 프로젝트를 생성하고, 샘플 데이터를 추가한 뒤 React 앱에서 데이터를 조회하는 과정을 정리합니다.

## 1\. Supabase 프로젝트 생성하기

[database.new](https://database.new)로 이동하여 새로운 Supabase 프로젝트를 생성합니다.

또는, **Management API**를 사용하여 프로젝트를 생성할 수도 있습니다.

```bash
# 먼저 https://supabase.com/dashboard/account/tokens 에서 액세스 토큰을 가져옵니다.
export SUPABASE_ACCESS_TOKEN="your-access-token"

# 조직 ID 확인을 위해 조직 목록을 조회합니다.
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  https://api.supabase.com/v1/organizations

# 새 프로젝트 생성 (<org-id>를 본인의 조직 ID로 변경하세요)
curl -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": "<org-id>",
    "name": "My Project",
    "region": "us-east-1",
    "db_pass": "<your-secure-password>"
  }'
```

프로젝트가 생성되면 [Table Editor](https://www.google.com/search?q=/dashboard/project/_/editor)로 이동하여 새 테이블을 만들고 데이터를 입력합니다.

또는, 프로젝트의 [SQL Editor](https://www.google.com/search?q=/dashboard/project/_/sql/new)에서 아래 스니펫을 실행하여 샘플 데이터가 포함된 `instruments` 테이블을 생성할 수 있습니다.

```sql
-- 테이블 생성
create table instruments (
  id bigint primary key generated always as identity,
  name text not null
);

-- 샘플 데이터 삽입
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello');

-- 행 레벨 보안(RLS) 활성화
alter table instruments enable row level security;
```

그 후, RLS 정책을 추가하여 데이터를 공개적으로 읽을 수 있도록 설정합니다.

```sql
create policy "public can read instruments"
on public.instruments
for select to anon
using (true);
```

---

## 2\. React 앱 생성하기

[Vite](https://vitejs.dev/guide/) 템플릿을 사용하여 React 앱을 생성합니다.

```bash
npm create vite@latest my-app -- --template react
```

---

## 3\. Supabase 클라이언트 라이브러리 설치하기

React 앱에서 Supabase를 편리하게 다루기 위해 `supabase-js` 라이브러리를 설치합니다.

```bash
cd my-app && npm install @supabase/supabase-js
```

---

## 4\. Supabase 환경 변수 설정하기

`.env.local` 파일을 생성하고 Supabase 연결 변수들을 입력합니다.

```text
# .env.local
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- **Project URL 및 Key**: 프로젝트의 [Connect 다이얼로그](https://www.google.com/search?q=/dashboard/project/_)에서 확인 가능합니다.
- **API Key 참고**: Supabase는 보안 향상을 위해 키 시스템을 전환 중입니다. 기존의 `anon` 키와 새로운 `sb_publishable_xxx` 형식의 **Publishable key** 모두 사용 가능합니다. 자세한 내용은 [API 키 문서](https://www.google.com/search?q=/docs/guides/api/api-keys)를 확인하세요.

---

## 5\. 앱에서 데이터 조회하기

`App.jsx`의 내용을 아래 코드로 교체합니다. `getInstruments` 함수를 통해 데이터를 가져오고 Supabase 클라이언트를 사용하여 화면에 출력합니다.

```jsx
// src/App.jsx
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 환경 변수를 사용하여 Supabase 클라이언트 생성
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

function App() {
  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data } = await supabase.from('instruments').select();
    setInstruments(data);
  }

  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  );
}

export default App;
```

---

## 6\. 앱 실행하기

개발 서버를 실행하고 브라우저에서 `http://localhost:5173`에 접속하여 악기 목록이 정상적으로 출력되는지 확인합니다.

```bash
npm run dev
```

---

## 다음 단계

- 앱에 [인증(Auth)](https://www.google.com/search?q=/docs/guides/auth) 설정하기
- 데이터베이스에 [더 많은 데이터 삽입](https://www.google.com/search?q=/docs/guides/database/import-data)하기
- [Storage](https://www.google.com/search?q=/docs/guides/storage)를 사용하여 정적 파일 업로드 및 활용하기

# Next.js에서 Supabase 시작하기

[공식 문서](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

Supabase 프로젝트를 생성하고, 샘플 데이터를 추가한 뒤 Next.js 앱에서 데이터를 조회하는 방법을 정리합니다.

## 1\. Supabase 프로젝트 생성하기

[database.new](https://database.new)로 이동하여 새로운 Supabase 프로젝트를 생성합니다.

또는, 아래와 같이 **Management API**를 사용하여 프로젝트를 생성할 수도 있습니다.

```bash
# 먼저 https://supabase.com/dashboard/account/tokens 에서 액세스 토큰을 가져옵니다.
export SUPABASE_ACCESS_TOKEN="your-access-token"

# 조직 ID를 확인하기 위해 조직 목록을 조회합니다.
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  https://api.supabase.com/v1/organizations

# 새 프로젝트 생성 (<org-id>를 본인의 조직 ID로 교체하세요)
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

프로젝트가 생성되면 [Table Editor](https://supabase.com/dashboard/project/_/editor)로 이동하여 새 테이블을 만들고 데이터를 입력합니다.

또는, 프로젝트의 [SQL Editor](https://supabase.com/dashboard/project/_/sql/new)에서 아래 스니펫을 실행하여 샘플 데이터가 포함된 `instruments` 테이블을 생성할 수 있습니다.

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

그 후, RLS 정책을 추가하여 테이블의 데이터를 공개적으로 읽을 수 있도록 설정합니다.

```sql
create policy "public can read instruments"
on public.instruments
for select to anon
using (true);
```

---

## 2\. Next.js 앱 생성하기

`create-next-app` 명령과 `with-supabase` 템플릿을 사용하여 앱을 생성합니다. 이 템플릿은 다음 설정이 미리 포함되어 있습니다.

- [쿠키 기반 인증(Cookie-based Auth)](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=package-manager&package-manager=npm&queryGroups=framework&framework=nextjs&queryGroups=environment&environment=server)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

<!-- end list -->

```bash
npx create-next-app -e with-supabase
```

---

## 3\. Supabase 환경 변수 설정하기

`.env.example` 파일의 이름을 `.env.local`로 변경하고 Supabase 연결 변수들을 입력합니다.

```text
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

- **Project URL 및 Key**: 프로젝트의 [Connect 다이얼로그](https://supabase.com/dashboard/project/_?showConnect=true&connectTab=frameworks&framework=nextjs)에서 확인할 수 있습니다.
- **API Key 종류**: 현재 Supabase는 보안 향상을 위해 키 시스템을 전환 중입니다. 기존의 `anon` 키(클라이언트 사이드용)와 `service_role` 키(서버 사이드용)를 그대로 사용하거나, 신규 `sb_publishable_xxx` 형식의 키를 사용할 수 있습니다. 상세 내용은 [API 키 문서](https://supabase.com/docs/guides/api/api-keys)를 참고하세요.

---

## 4\. Next.js에서 Supabase 데이터 조회하기

`app/instruments/page.tsx` 파일을 생성하고 다음 코드를 작성합니다. 이 코드는 Supabase의 `instruments` 테이블에서 모든 행을 선택하여 페이지에 렌더링합니다.

```tsx
// app/instruments/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from('instruments').select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<p>Loading instruments...</p>}>
      <InstrumentsData />
    </Suspense>
  );
}
```

---

## 5\. 앱 실행하기

개발 서버를 실행하고 브라우저에서 `http://localhost:3000/instruments`로 접속하면 악기 목록이 나타나는 것을 확인할 수 있습니다.

```bash
npm run dev
```

---

## 다음 단계

- 앱에 [인증(Auth)](https://supabase.com/docs/guides/auth) 설정하기
- 데이터베이스에 [더 많은 데이터 삽입](https://supabase.com/docs/guides/database/import-data)하기
- [Storage](https://supabase.com/docs/guides/storage)를 사용하여 정적 파일 업로드 및 서빙하기

# React와 Supabase로 사용자 관리 앱 만들기

[공식 문서](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

이 가이드에서는 사용자를 인증하고, 프로필 정보를 저장하며, 프로필 사진을 업로드할 수 있는 기본적인 사용자 관리 앱을 구축하는 방법을 학습합니다.

## 🚀 주요 기능

- **Supabase Database**: 사용자 데이터를 저장하는 Postgres 데이터베이스 및 RLS(행 레벨 보안)를 통한 데이터 보호.
- **Supabase Auth**: 사용자 가입 및 로그인 기능.
- **Supabase Storage**: 프로필 사진 업로드 기능.

---

## 1. 프로젝트 설정

앱을 빌드하기 전에 Supabase 대시보드에서 프로젝트를 생성하고 데이터베이스 스키마를 설정해야 합니다.

### 프로젝트 생성

1. [Supabase Dashboard](/dashboard)에서 새 프로젝트를 생성합니다.
2. 프로젝트 상세 정보를 입력하고 데이터베이스가 실행될 때까지 기다립니다.

### 데이터베이스 스키마 설정

SQL 에디터의 "User Management Starter" 퀵스타트를 사용하거나, 아래 SQL을 직접 실행하여 `profiles` 테이블과 보안 정책을 설정합니다.

```sql
-- 공용 프로필 테이블 생성
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- 행 레벨 보안(RLS) 설정
alter table profiles enable row level security;

create policy "프로필은 누구나 조회 가능합니다." on profiles
  for select using (true);

create policy "사용자는 자신의 프로필을 생성할 수 있습니다." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "사용자는 자신의 프로필을 수정할 수 있습니다." on profiles
  for update using ((select auth.uid()) = id);

-- 회원가입 시 자동으로 프로필 항목을 생성하는 트리거
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 스토리지 설정 (아바타용 버킷)
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- 스토리지 접근 제어 정책
create policy "아바타 이미지는 전체 공개입니다." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "누구나 아바타를 업로드할 수 있습니다." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "사용자는 자신의 아바타를 수정할 수 있습니다." on storage.objects
  for update using ((select auth.uid()) = owner) with check (bucket_id = 'avatars');
```

### API 정보 확인

프로젝트의 **Connect** 다이얼로그나 **Settings > API** 섹션에서 `Project URL`과 `anon key`를 확인합니다.

---

## 2. 앱 빌드하기

### React 앱 초기화

[Vite](https://vitejs.dev/guide/)를 사용하여 프로젝트를 생성하고 필요한 라이브러리를 설치합니다.

```bash
npm create vite@latest supabase-react -- --template react
cd supabase-react
npm install @supabase/supabase-js
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 확인한 API 정보를 입력합니다.

```text
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

### Supabase 클라이언트 설정

`src/supabaseClient.js` 파일을 만들어 클라이언트를 초기화합니다.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 3. 컴포넌트 구현

### 로그인 컴포넌트 (`src/Auth.jsx`)

비밀번호 없이 이메일로 로그인할 수 있는 **매직 링크(Magic Link)** 방식을 사용합니다.

### 아바타 업로드 위젯 (`src/Avatar.jsx`)

Supabase Storage를 사용하여 프로필 사진을 업로드하고 미리보기를 보여주는 컴포넌트를 작성합니다.

### 계정 관리 페이지 (`src/Account.jsx`)

로그인한 사용자가 자신의 프로필 정보를 수정하고 아바타 이미지를 관리할 수 있는 페이지를 구현합니다.

---

## 4. 앱 실행

`src/App.jsx`에서 세션 유무를 확인하여 로그인 페이지(`Auth.jsx`) 또는 계정 페이지(`Account.jsx`)를 렌더링하도록 설정한 후 앱을 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 완료된 앱을 확인하세요! 이메일을 입력하면 **Confirm Your Signup**이라는 제목의 매직 링크 이메일을 받게 됩니다. 🎉

---

**함께 보면 좋은 링크:**

- [GitHub 전체 예제 확인하기](https://github.com/supabase/supabase/tree/master/examples/user-management/react-user-management)
- [Supabase Auth 가이드](/docs/guides/auth)
- [Supabase Storage 가이드](/docs/guides/storage)

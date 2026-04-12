# Next.js와 Supabase로 사용자 관리 앱 만들기

[공식 문서](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

이 튜토리얼에서는 사용자를 인증하고, 프로필 정보를 데이터베이스에 저장하며, 프로필 사진을 업로드할 수 있는 기본적인 사용자 관리 앱을 구축하는 방법을 학습합니다.

## 🚀 사용되는 주요 기능

- **Supabase Database**: 사용자 데이터를 저장하는 Postgres 데이터베이스.
- **Row Level Security (RLS)**: 사용자가 본인의 정보에만 접근할 수 있도록 데이터를 보호.
- **Supabase Auth**: 가입 및 로그인 기능 제공.
- **Supabase Storage**: 프로필 사진 업로드 기능.

---

## 1. 프로젝트 설정

### 프로젝트 생성 및 데이터베이스 스키마 설정

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 새 프로젝트를 생성합니다.
2. **SQL 에디터(SQL Editor)**에서 'User Management Starter' 퀵스타트를 실행하거나 아래 SQL을 복사하여 실행합니다.

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

create policy "프로필은 누구나 볼 수 있습니다." on profiles
  for select using (true);

create policy "사용자는 본인의 프로필을 삽입할 수 있습니다." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "사용자는 본인의 프로필을 업데이트할 수 있습니다." on profiles
  for update using ((select auth.uid()) = id);

-- 회원가입 시 자동으로 프로필을 생성하는 트리거 설정
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

-- Storage 설정 (아바타 이미지용 버킷)
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Storage 접근 제어 정책
create policy "아바타 이미지는 공개적으로 접근 가능합니다." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "누구나 아바타를 업로드할 수 있습니다." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

---

## 2. 앱 구축 시작

### Next.js 초기화 및 패키지 설치

먼저 Next.js 앱을 생성하고 Supabase 클라이언트 라이브러리를 설치합니다.

```bash
npx create-next-app@latest --ts --use-npm supabase-nextjs
cd supabase-nextjs
npm install @supabase/supabase-js @supabase/ssr
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 프로젝트의 API URL과 Anon Key를 입력합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

---

## 3. 인증(Auth) 및 서버 측 설정

### Supabase SSR 설정

Next.js는 서버 컴포넌트와 클라이언트 컴포넌트가 혼재하므로 `@supabase/ssr`을 사용하여 쿠키 기반의 인증을 설정하는 것이 중요합니다.

- **Client Component용 클라이언트**: 브라우저에서 실행.
- **Server Component용 클라이언트**: 서버, Server Actions, Route Handlers에서 실행.

### 이메일 템플릿 변경

서버 측 인증 흐름을 지원하기 위해 Supabase 대시보드(`Auth > Templates`)에서 **Confirm signup** 템플릿을 수정해야 합니다.

- `{{ .ConfirmationURL }}`을 다음과 같이 변경합니다:
  `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`

---

## 4. 주요 페이지 구현

### 로그인 페이지

`app/login` 폴더를 생성하고 로그인/회원가입 폼을 만듭니다. `Server Actions`를 통해 Supabase에 가입 요청을 보냅니다.

### 계정 관리 페이지

사용자가 로그인한 후 자신의 이름, 웹사이트, 프로필 사진을 수정할 수 있는 `AccountForm` 컴포넌트를 구현합니다.

### 이메일 확인(Confirmation) 엔드포인트

서버에서 `token_hash`를 받아 세션으로 교환하고 사용자를 계정 페이지로 리다이렉트시키는 로직을 작성합니다.

---

## 5. 보너스: 프로필 사진 업로드 (Storage)

Supabase Storage를 사용하여 이미지 업로드 위젯을 만듭니다. 사용자가 사진을 선택하면 `avatars` 버킷에 업로드되고, 해당 경로가 `profiles` 테이블의 `avatar_url`에 저장되도록 구성합니다.

---

## ✅ 요약 및 실행

모든 설정이 완료되었다면 다음 명령어로 앱을 실행합니다.

```bash
npm run dev
```

이제 `localhost:3000/login`에서 회원가입을 하면 확인 이메일이 발송되며, 인증 후 본인의 프로필을 관리할 수 있는 멋진 앱이 완성됩니다! 🎉

---

**더 알아보기:**

- [GitHub 전체 예제 코드](https://github.com/supabase/supabase/tree/master/examples/user-management/nextjs-user-management)
- [Supabase SSR 공식 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)

이 내용 중에서 특정 코드 구현부(예: `client.ts`나 `AccountForm`의 상세 코드)가 더 필요하시면 말씀해 주세요! 직접 작성해 드릴 수도 있습니다. 😊

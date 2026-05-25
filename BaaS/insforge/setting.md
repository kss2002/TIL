# InsForge + Next.js with GitHub Copilot

## InsForge란?

InsForge는 **Database / Auth / Storage / AI**를 올인원으로 제공하는 BaaS(Backend as a Service)다.

Supabase와 포지셔닝이 비슷하지만, AI 코딩 에이전트(Cursor, Claude Code, Copilot 등)와의 연동을 **MCP + CLI 방식**으로 공식 지원한다는 점이 특징이다.

## 공통 셋업 (어떤 케이스든 동일)

### 1. InsForge 프로젝트 생성

[insforge.dev](https://insforge.dev)에서 프로젝트를 만들고 `project-id`와 `anon-key`를 메모해 둔다.

### 2. CLI 연결

```bash
npx @insforge/cli link --project-id <your-project-id>
```

에이전트가 프로젝트 ID와 키를 읽어올 수 있게 해주는 링킹 단계다.

### 3. MCP 설정 (GitHub Copilot / VS Code 기준)

Copilot은 VS Code MCP 설정 경로를 사용한다.  
공식 문서 기준: [insforge.dev MCP Setup](https://docs.insforge.dev/mcp-setup)

- 💡 MCP가 연결되면 Copilot이 **스키마 조회 → 쿼리 실행 → 코드 배포**를 에디터 안에서 처리할 수 있다.

### 4. InsForge 클라이언트 초기화 (`lib/insforge.ts`)

```typescript
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: 'https://your-project.us-east.insforge.app',
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
```

- `.env.local`에 키를 분리하는 것 잊지 말 것.

## Case 1. 내 프로젝트를 빌딩할 때

**상황:** 사이드 프로젝트 or 포트폴리오 작업. 스키마 설계부터 내가 주도한다.

### 접근 방식

InsForge의 AI 에이전트 연동을 **최대한 활용**한다.  
스키마 정의 → 샘플 데이터 삽입 → UI 컴포넌트 생성까지 Copilot에게 프롬프트로 위임한다.

### Copilot 프롬프트 예시

```
Create a new Next.js app with TypeScript and Tailwind CSS 3.4.
Install the InsForge SDK and set up the client configuration.

In my InsForge database, create a sports table with id and name columns.
Add sample data: basketball, soccer, and tennis. Make it publicly readable.

Create a page at /sports that fetches and displays all sports from the database.
```

Copilot이 `lib/insforge.ts`, `app/sports/page.tsx` 등을 **자동 생성**해 준다.  
스키마 변경이나 기능 추가도 후속 프롬프트로 이어서 작업 가능하다.

### 추천 확장 프롬프트 (기능 추가 시)

| 기능                   | 프롬프트 키워드                                                     |
| ---------------------- | ------------------------------------------------------------------- |
| 폼 + 유효성 검사       | `Add a form to create new items with validation and error handling` |
| 인증 (회원가입/로그인) | `Add user authentication with sign up and login pages`              |
| 즐겨찾기 기능          | `Add a favorites feature stored in a user_favorites table`          |
| 파일 업로드            | `Add images using InsForge Storage, allow upload and display`       |
| AI 챗                  | `Add an AI chat feature using InsForge AI with streaming responses` |

### 장단점 정리

| 장점                                              | 단점                                |
| ------------------------------------------------- | ----------------------------------- |
| 스키마 → UI → 배포를 에이전트가 one-shot으로 처리 | InsForge 벤더 의존성이 생김         |
| 인프라 관리 없이 빠른 MVP 가능                    | 복잡한 쿼리 최적화는 직접 검토 필요 |
| MCP 연동으로 Copilot이 DB 컨텍스트를 자동 파악    | 무료 플랜 한도 확인 필요            |

## Case 2. 외주를 받을 때

**상황:** 클라이언트의 요구사항이 있고, 기존 코드베이스가 있거나 스택을 지정받는 경우.

### 접근 방식

Copilot을 **보조 도구**로만 쓰고, InsForge 연동은 **점진적으로** 추가한다.  
클라이언트 코드에 InsForge를 밀어넣기 전에 반드시 아래를 먼저 확인한다.

### 체크리스트 (외주 시작 전)

- [ ] 클라이언트가 InsForge 사용에 동의했는가? (벤더 락인 이슈 공유)
- [ ] 기존 DB가 있다면 마이그레이션 전략은?
- [ ] `anon-key`를 환경변수로만 관리하고 있는가? (`.gitignore` 확인)
- [ ] 클라이언트 레포에 커밋하기 전 `lib/insforge.ts`의 하드코딩 키 제거

### 안전한 연동 순서

```
1. 클라이언트 레포 세팅 확인
   └── .env.example에 NEXT_PUBLIC_INSFORGE_ANON_KEY 추가

2. InsForge 프로젝트 생성 (내 계정 or 클라이언트 계정)
   └── 외주라면 클라이언트 계정으로 생성 권장 (소유권 이슈 방지)

3. CLI 링크 + MCP 설정 (로컬에서만)
   └── .vscode/settings.json은 .gitignore 처리

4. Copilot으로 점진적 기능 추가
   └── 기존 컴포넌트와 충돌 여부 직접 검토
```

### Copilot 활용 팁 (외주 맥락)

기존 코드가 있는 경우, 프롬프트에 **제약 조건**을 명시해야 Copilot이 엉뚱한 파일을 건드리지 않는다.

```
# 좋은 프롬프트 예시 (외주 시)
In the existing Next.js project, add InsForge integration ONLY for the /dashboard/posts page.
Do NOT modify existing components in /components/ui.
Use the existing insforge client from lib/insforge.ts.
Fetch posts data and display it in the existing PostList component.
```

### 주의사항

- **키 관리:** `anon-key`는 공개되어도 RLS(Row Level Security) 설정으로 보호 가능하지만,  
  외주 프로젝트에서는 클라이언트에게 RLS 설정 여부를 반드시 확인시킬 것
- **소유권:** 외주 납품 후 InsForge 프로젝트 소유권을 클라이언트에게 이전하는 플로우 사전 합의
- **에이전트 코드 검토:** Copilot이 생성한 DB 쿼리는 납품 전 직접 검토 필수 (클라이언트 데이터가 걸린 문제)

## 핵심 정리

```
내 프로젝트  → Copilot에게 공격적으로 위임, 스키마부터 UI까지 one-shot
외주 프로젝트 → Copilot은 보조, 클라이언트 코드 보호 + 키/소유권 관리가 우선
```

공통적으로 **MCP + CLI 셋업**이 제대로 되어야 Copilot이 InsForge 컨텍스트를 읽을 수 있다.

이게 빠지면 그냥 일반 코드 자동완성 수준으로 떨어진다.

## 참고 링크

- [InsForge 공식 문서](https://docs.insforge.dev)
- [InsForge Next.js 가이드](https://docs.insforge.dev/examples/framework-guides/nextjs)
- [MCP Setup](https://docs.insforge.dev/mcp-setup)
- [Quickstart](https://docs.insforge.dev/quickstart)

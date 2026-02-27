# Git Commit Convention Guide

### Conventional Commits 표준

**사이트**

https://www.conventionalcommits.org/ko/v1.0.0/

### 기본 형식

```
<type>(<scope>): <subject>
<blank line>
<body>
<blank line>
<footer>
```

## Type 종류

```
feat       새로운 기능 추가
fix        버그 수정
docs       문서 수정
style      코드 스타일 변경 (포매팅, 세미콜론 등)
refactor   코드 리팩토링
perf       성능 개선
test       테스트 추가 또는 수정
chore      빌드, 패키지 관리, CI/CD 등
ci         CI/CD 설정 변경
revert     이전 커밋 되돌리기
```

## Scope 예시

```
feat(auth): add user login
fix(database): fix connection leak
style(ui): format button component
perf(api): optimize query
```

## Subject 규칙

- 50자 이내
- 첫 글자는 대문자
- 마침표 없음
- 명령조 사용 (fixed X, fix O)

### Good Examples

```
feat(auth): add JWT token refresh
fix(payment): resolve edge case for refunds
docs(api): update authentication examples
refactor(database): simplify query logic
perf(ui): optimize image loading
test(auth): add comprehensive login tests
```

### Bad Examples

```
feat: added user authentication (과거형)
fix: fix bug (모호함)
docs: update (설명 부족)
style: formatting code. (마침표)
feat(auth): add login and payment system (너무 많은 내용)
```

## Body 작성

변경사항을 상세히 설명합니다.

### Body 예시

```
feat(auth): implement JWT-based user authentication

Add a complete JWT authentication system with:
- User login endpoint
- Token refresh mechanism
- Session management
- Secure password hashing

Previously used session-based auth but switched to JWT
for better scalability in microservices architecture.
```

## Footer

이슈 추적 및 breaking changes를 표시합니다.

### Footer 형식

```
Closes #123
Fixes #456
Related to #789

BREAKING CHANGE: response format changed from
{"user": {...}} to {"data": {"user": {...}}}
```

## commitlint 설정

### 설치

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'revert',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
```

### Husky 연동

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

## Branch Convention

### 형식

```
<type>/<issue-id>/<description>
```

### 예시

```
feature/123/user-authentication
bugfix/456/fix-memory-leak
hotfix/789/security-patch
release/1.0.0
chore/cleanup-code
docs/update-readme
```

## 자주 하는 실수

### 실수 1: 여러 기능을 한 커밋에

```
❌ Bad:
feat: add login and payment system

✅ Good:
feat(auth): add user login
feat(payment): add payment processing
```

### 실수 2: 애매한 메시지

```
❌ Bad:
fix: fix bug
update: update code

✅ Good:
fix(auth): resolve token expiration issue
refactor(api): simplify error handling
```

### 실수 3: 과거형 사용

```
❌ Bad:
feat: added user authentication
fix: fixed memory leak

✅ Good:
feat: add user authentication
fix: fix memory leak
```

### 실수 4: 너무 긴 Subject

```
❌ Bad:
feat(auth): add user login functionality with JWT token and session management

✅ Good:
feat(auth): add JWT-based user login
(상세 내용은 body에 작성)
```

## 커밋 수정

### 마지막 커밋 수정

```bash
git commit --amend -m "새로운 메시지"
git add .
git commit --amend --no-edit
```

### 이전 커밋 수정

```bash
git rebase -i HEAD~3
# pick/reword/squash 선택
```

### 커밋 되돌리기

```bash
git revert abc123      # 되돌리는 새 커밋 생성
git reset --soft HEAD~1  # 커밋만 취소
git reset --hard HEAD~1  # 완전히 되돌리기
```

## 유용한 Git 명령어

```bash
# 로그 확인
git log --oneline
git log --oneline --graph --all --decorate
git log --stat

# 특정 파일 히스토리
git log -- src/file.ts

# Type별 필터링
git log --grep="^feat"
git log --grep="^fix"

# Git alias 설정
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.st "status"
git config --global alias.co "checkout"
```

## Squash & Rebase

### 여러 커밋을 하나로 (Squash)

```bash
git rebase -i HEAD~3

# 에디터에서:
pick aaaaaa feat: add login part 1
squash bbbbbb feat: add login part 2
squash cccccc feat: add login part 3
```

### Rebase로 히스토리 정리

```bash
git rebase develop
git add .
git rebase --continue
```

## Changelog 자동 생성

### standard-version 설치

```bash
npm install -D standard-version
```

### package.json

```json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

### 실행

```bash
npm run release
```

자동으로 CHANGELOG.md와 버전 태그가 생성됩니다.

## Best Practices

### 커밋 크기

```
✅ Good:
- 한 기능당 1~5개 커밋
- 각 커밋이 논리적으로 독립적
- 각 커밋만으로도 코드가 작동

❌ Bad:
- 100개 파일을 1개 커밋에
- 서로 다른 기능을 1개 커밋에
```

### 커밋 순서

1. 의존성 업데이트
2. 테스트 추가
3. 기능 구현
4. 리팩토링
5. 문서 수정

### PR 리뷰 전 확인

```bash
git log --oneline -5
git diff develop
git diff develop --name-only
```

## CONTRIBUTING.md Template

```markdown
# Git Commit Convention

## Format

<type>(<scope>): <subject>

## Type

- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서
- style: 포매팅
- refactor: 리팩토링
- perf: 성능 개선
- test: 테스트
- chore: 빌드, 의존성
- ci: CI/CD

## Scope

프로젝트 영역: auth, user, api, ui, db, payment

## Subject Rules

1. 50자 이내
2. 첫 글자 대문자
3. 마침표 없음
4. 명령조 사용

## Examples

feat(auth): add JWT token refresh
fix(payment): handle edge case
docs(api): update endpoint docs
refactor(db): simplify query
perf(ui): optimize loading
test(auth): add login tests
```

## Setup Checklist

```
[ ] commitlint 설치
[ ] Husky 설정
[ ] .gitmessage 파일 생성
[ ] CONTRIBUTING.md 작성
[ ] 팀에 컨벤션 공유
[ ] commitlint 규칙 커스터마이징
[ ] 첫 커밋으로 테스트
```

## FAQ

### Q: 영어와 한국어 혼용해도 되나?

A: 팀이 정한 하나의 언어로 통일하세요.

```
✅ All English / All Korean
❌ Mixed language
```

### Q: Breaking change 표시 방법?

A: Footer에 명시

```
BREAKING CHANGE:
Old: {"user": {...}}
New: {"data": {"user": {...}}}
```

### Q: 모든 커밋을 컨벤션을 따라야 하나?

A: 네, 작은 것도 중요합니다.

```
✅ style: fix indentation
✅ docs: update readme
✅ test: add edge case
```

### Q: 여러 이슈를 한 커밋에서 해결?

A: Footer에 모두 명시

```
Closes #123
Fixes #456
Related to #789
```

## Key Benefits

✅ 명확한 히스토리
✅ Changelog 자동 생성
✅ 버전 자동 업데이트
✅ 팀 협업 개선
✅ 버그 원인 빠른 파악

**Git 컨벤션은 팀 협업의 기초입니다!**

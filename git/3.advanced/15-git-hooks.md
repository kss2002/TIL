# Git Hooks

## 개요

**Git Hooks**는 Git 이벤트 전후에 자동으로 실행되는 스크립트입니다.
커밋 메시지 검증, 코드 포맷팅, 테스트 실행 등을 자동화할 수 있습니다.

## Hook 위치

```bash
# 로컬 Hook (저장소마다)
.git/hooks/

# 기본 샘플 파일들
.git/hooks/pre-commit.sample
.git/hooks/commit-msg.sample
# ...
```

Hook을 활성화하려면:

1. `.sample` 확장자 제거
2. 실행 권한 부여: `chmod +x .git/hooks/pre-commit`

## 주요 Hook 종류

### 커밋 관련

| Hook                 | 실행 시점           | 용도               |
| -------------------- | ------------------- | ------------------ |
| `pre-commit`         | 커밋 메시지 입력 전 | 코드 검사, 린트    |
| `prepare-commit-msg` | 메시지 편집 전      | 메시지 템플릿 생성 |
| `commit-msg`         | 메시지 입력 후      | 메시지 형식 검증   |
| `post-commit`        | 커밋 완료 후        | 알림 전송          |

### 기타 Hook

| Hook            | 실행 시점   | 용도                  |
| --------------- | ----------- | --------------------- |
| `pre-push`      | push 전     | 테스트 실행           |
| `pre-rebase`    | rebase 전   | rebase 가능 여부 확인 |
| `post-checkout` | checkout 후 | 환경 설정             |
| `post-merge`    | merge 후    | 의존성 설치           |

## Hook 작성 예시

### pre-commit: 린트 검사

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running pre-commit checks..."

# ESLint 실행
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Lint 검사 실패. 커밋이 중단됩니다."
    exit 1
fi

# 테스트 실행
npm test
if [ $? -ne 0 ]; then
    echo "❌ 테스트 실패. 커밋이 중단됩니다."
    exit 1
fi

echo "✅ 모든 검사 통과!"
exit 0
```

### commit-msg: 메시지 형식 검증

```bash
#!/bin/bash
# .git/hooks/commit-msg

commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"

if ! [[ $commit_msg =~ $pattern ]]; then
    echo "❌ 커밋 메시지 형식이 올바르지 않습니다."
    echo "형식: <type>(<scope>): <subject>"
    echo "예시: feat(auth): 로그인 기능 추가"
    exit 1
fi

exit 0
```

### pre-push: 테스트 실행

```bash
#!/bin/bash
# .git/hooks/pre-push

echo "Running tests before push..."

npm test
if [ $? -ne 0 ]; then
    echo "❌ 테스트 실패. push가 중단됩니다."
    exit 1
fi

echo "✅ 테스트 통과!"
exit 0
```

### post-merge: 의존성 설치

```bash
#!/bin/bash
# .git/hooks/post-merge

# package.json이 변경되었는지 확인
changed_files=$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)

if echo "$changed_files" | grep -q "package.json"; then
    echo "📦 package.json 변경 감지. npm install 실행..."
    npm install
fi
```

## Husky (권장)

Husky는 Git Hooks를 쉽게 관리할 수 있는 도구입니다.

### 설치

```bash
npm install husky --save-dev
npx husky install
```

### package.json 설정

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Hook 추가

```bash
# pre-commit hook 추가
npx husky add .husky/pre-commit "npm run lint"

# commit-msg hook 추가
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'
```

### .husky/pre-commit 예시

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm test
```

## lint-staged

스테이징된 파일에만 검사를 실행합니다.

### 설치

```bash
npm install lint-staged --save-dev
```

### package.json 설정

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,scss}": ["prettier --write"]
  }
}
```

### Husky와 함께

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

## commitlint

커밋 메시지 형식을 검증합니다.

### 설치

```bash
npm install @commitlint/cli @commitlint/config-conventional --save-dev
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case']],
  },
};
```

### Husky와 함께

```bash
npx husky add .husky/commit-msg 'npx commitlint --edit "$1"'
```

## Hook 공유

`.git/hooks`는 Git으로 추적되지 않습니다. 팀과 공유하려면:

### 방법 1: 스크립트 디렉토리 사용

```bash
# 프로젝트에 hooks 디렉토리 생성
mkdir .githooks

# `.githooks/pre-commit` 작성

# Git에 hooks 경로 설정
git config core.hooksPath .githooks
```

### 방법 2: Husky 사용 (권장)

Husky는 `.husky` 디렉토리에 hooks를 저장하고 Git으로 추적합니다.

## 주의사항

> ⚠️ **Hook 우회**
> `--no-verify` 옵션으로 hook을 건너뛸 수 있습니다.
> 중요한 검증은 CI/CD에서도 수행하세요.

```bash
git commit --no-verify -m "긴급 수정"
git push --no-verify
```

> ⚠️ **실행 권한**
> Hook 파일에 실행 권한이 필요합니다.

```bash
chmod +x .git/hooks/pre-commit
```

> ⚠️ **성능**
> Hook이 오래 걸리면 개발 경험이 나빠집니다.
> lint-staged 등으로 검사 범위를 최소화하세요.

## 팁

```bash
# 현재 hooks 경로 확인
git config core.hooksPath

# hook 비활성화
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled

# 임시 우회
git commit --no-verify -m "message"
```

## 관련 문서

- [스테이징과 커밋](./03-git-staging-commit.md)
- [Git 설정](./19-git-config.md)

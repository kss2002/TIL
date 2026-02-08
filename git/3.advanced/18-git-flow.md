# Git Flow 전략

## 개요

**Git Flow**는 Vincent Driessen이 제안한 브랜치 관리 전략입니다.
대규모 프로젝트에서 릴리스 주기를 체계적으로 관리할 수 있습니다.

## Git Flow 브랜치 구조

```
                    ┌──────────────────────────────────────────────────────┐
                    │                    master/main                        │
                    │   v1.0         v1.1              v2.0                 │
                    │    ●───────────●─────────────────●                   │
                    │   /           /                  /                    │
hotfix              │  /     ●─────/                  /                    │
                    │ /     hotfix                   /                     │
                    │/                              /                      │
release             │            ●────●────────────●                       │
                    │           release/1.1                                │
                    │          /            \                              │
develop             │●────●───●──────●───────●────●────●                   │
                    │        \              /                              │
feature             │         ●────●──────●                                │
                    │        feature/login                                 │
                    └──────────────────────────────────────────────────────┘
```

## 브랜치 역할

| 브랜치      | 목적        | 생성 시점      | 머지 대상     |
| ----------- | ----------- | -------------- | ------------- |
| `main`      | 출시 버전   | 항상 존재      | -             |
| `develop`   | 개발 통합   | 항상 존재      | -             |
| `feature/*` | 기능 개발   | 기능 시작 시   | develop       |
| `release/*` | 릴리스 준비 | 릴리스 시작 시 | main, develop |
| `hotfix/*`  | 긴급 수정   | 버그 발생 시   | main, develop |

## Git Flow 설치

```bash
# macOS
brew install git-flow

# Ubuntu/Debian
apt-get install git-flow

# Windows (Git Bash)
# Git for Windows에 포함됨
```

## Git Flow 초기화

```bash
git flow init

# 대화형 설정
# Branch name for production releases: [main]
# Branch name for "next release" development: [develop]
# Feature branches prefix: [feature/]
# Release branches prefix: [release/]
# Hotfix branches prefix: [hotfix/]
# Support branches prefix: [support/]
# Version tag prefix: []
```

## Feature 브랜치

새로운 기능을 개발합니다.

```bash
# feature 브랜치 시작
git flow feature start login

# 동일한 작업 (git flow 없이)
git checkout -b feature/login develop

# 작업...
git add .
git commit -m "feat: 로그인 기능 추가"

# feature 완료 (develop에 머지)
git flow feature finish login

# 동일한 작업 (git flow 없이)
git checkout develop
git merge --no-ff feature/login
git branch -d feature/login
```

### Feature 공유

```bash
# 원격에 공유
git flow feature publish login

# 다른 사람의 feature 가져오기
git flow feature pull origin login

# 또는 track
git flow feature track login
```

## Release 브랜치

릴리스를 준비합니다. 버그 수정, 문서화, 버전 번호 변경 등.

```bash
# release 브랜치 시작
git flow release start 1.2.0

# 버전 번호 업데이트, 버그 수정 등
git commit -m "chore: 버전 1.2.0 준비"

# release 완료 (main과 develop에 머지)
git flow release finish 1.2.0

# 동일한 작업 (git flow 없이)
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0
```

## Hotfix 브랜치

운영 중인 버전의 긴급 버그를 수정합니다.

```bash
# hotfix 시작 (main에서)
git flow hotfix start 1.2.1

# 버그 수정
git commit -m "fix: 긴급 보안 취약점 수정"

# hotfix 완료 (main과 develop에 머지)
git flow hotfix finish 1.2.1

# 동일한 작업 (git flow 없이)
git checkout main
git merge --no-ff hotfix/1.2.1
git tag -a v1.2.1 -m "Hotfix 1.2.1"
git checkout develop
git merge --no-ff hotfix/1.2.1
git branch -d hotfix/1.2.1
```

## GitHub Flow

Git Flow가 복잡하다면 더 간단한 GitHub Flow를 고려하세요.

```
main   ●───●───●───●───●───●
         \     /
feature   ●───●
         (PR)
```

### 규칙

1. `main`은 항상 배포 가능 상태
2. 모든 작업은 feature 브랜치에서
3. Pull Request로 코드 리뷰
4. 머지 후 즉시 배포

```bash
# feature 브랜치 생성
git checkout -b feature/new-feature main

# 작업 후 push
git push -u origin feature/new-feature

# GitHub에서 PR 생성
# 리뷰 후 main에 머지
# 배포
```

### GitHub Flow vs Git Flow

| 구분      | GitHub Flow   | Git Flow      |
| --------- | ------------- | ------------- |
| 복잡도    | 간단          | 복잡          |
| 배포 주기 | 짧음 (CI/CD)  | 정해진 릴리스 |
| 팀 규모   | 소규모~중규모 | 대규모        |
| 적합      | 웹 서비스     | 패키지 배포   |

## GitLab Flow

GitHub Flow + 환경별 브랜치

```
main ──→ staging ──→ production
```

- `main`: 개발 완료
- `staging`: 스테이징 환경
- `production`: 운영 환경

## 실전 워크플로우 예시

### 1. 기능 개발

```bash
# develop에서 feature 시작
git flow feature start user-profile

# 개발...
git commit -m "feat: 프로필 페이지 추가"
git commit -m "feat: 프로필 수정 기능"

# PR 리뷰를 위해 원격에 push
git flow feature publish user-profile

# 리뷰 완료 후 finish
git flow feature finish user-profile
```

### 2. 릴리스 준비

```bash
# develop의 기능이 완성되면
git flow release start 1.3.0

# 릴리스 준비 작업
# - 버전 번호 업데이트
# - CHANGELOG 작성
# - 마지막 버그 수정

git flow release finish 1.3.0

# 태그와 함께 push
git push origin main --tags
git push origin develop
```

### 3. 긴급 수정

```bash
# 운영 중 버그 발견
git flow hotfix start security-patch

# 수정
git commit -m "fix: XSS 취약점 수정"

# 완료
git flow hotfix finish security-patch

# 즉시 배포
git push origin main --tags
git push origin develop
```

## 주의사항

> ⚠️ **Git Flow의 복잡성**
> 작은 팀이나 빠른 배포가 필요한 프로젝트에는 과도할 수 있습니다.
> GitHub Flow나 trunk-based development도 고려하세요.

> ⚠️ **develop과 main 동기화**
> release/hotfix 완료 시 반드시 둘 다 머지해야 합니다.

## 팁

```bash
# 현재 브랜치 타입 확인
git flow config

# 모든 feature 브랜치 보기
git branch --list 'feature/*'

# Git Flow 없이 비슷하게 사용
git checkout -b feature/name develop
git checkout develop && git merge --no-ff feature/name
```

## 관련 문서

- [브랜치 기초](./05-git-branch-basics.md)
- [머지(병합)](./06-git-merge.md)
- [태그](./12-git-tag.md)

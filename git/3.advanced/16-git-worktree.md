# Worktree

## 개요

**git worktree**는 하나의 저장소에서 여러 작업 디렉토리(브랜치)를 동시에 체크아웃할 수 있는 기능입니다.
브랜치 전환 없이 여러 브랜치에서 동시에 작업할 수 있습니다.

## 왜 사용할까?

일반적인 상황:

```bash
# 긴급 버그 수정이 필요한데...
# 현재 작업 중인 feature 브랜치가 있음
git stash           # 작업 임시 저장
git checkout main   # 브랜치 전환
# 버그 수정...
git checkout feature
git stash pop       # 작업 복원
```

Worktree 사용:

```bash
# 별도 디렉토리에서 main 작업
git worktree add ../hotfix main
# feature 디렉토리는 그대로 유지
```

## 기본 사용법

### Worktree 추가

```bash
# 새 디렉토리에 브랜치 체크아웃
git worktree add <경로> <브랜치>

# 예시: main 브랜치를 ../main-hotfix에
git worktree add ../main-hotfix main

# 새 브랜치 생성과 함께
git worktree add -b hotfix/bug-123 ../hotfix main
```

### Worktree 목록

```bash
git worktree list

# 출력 예시
/home/user/project          a1b2c3d [main]
/home/user/project-feature  e4f5g6h [feature]
/home/user/project-hotfix   i7j8k9l [hotfix/bug-123]
```

### Worktree 제거

```bash
# worktree 제거 (디렉토리도 삭제)
git worktree remove ../hotfix

# 강제 제거 (변경사항 있어도)
git worktree remove --force ../hotfix

# 디렉토리 수동 삭제 후 정리
rm -rf ../hotfix
git worktree prune
```

## Worktree 구조

```
~/projects/
├── my-project/           # 메인 저장소
│   ├── .git/
│   ├── src/
│   └── ...
├── my-project-feature/   # worktree 1
│   ├── src/
│   └── ...
└── my-project-hotfix/    # worktree 2
    ├── src/
    └── ...
```

각 worktree는:

- 독립적인 작업 디렉토리
- `.git` 대신 `.git` 파일 (원본 참조)
- 모두 같은 저장소 객체 공유

## 실전 예시

### 동시에 여러 작업

```bash
# 현재 feature 브랜치에서 작업 중
# 프로젝트: ~/projects/app

# 긴급 버그 수정을 위한 worktree 생성
git worktree add -b hotfix/critical-bug ~/projects/app-hotfix main

# 터미널 2개 열어서 동시 작업
# 터미널 1: ~/projects/app (feature 계속)
# 터미널 2: ~/projects/app-hotfix (버그 수정)

# 버그 수정 완료 후
cd ~/projects/app-hotfix
git add .
git commit -m "fix: 긴급 버그 수정"
git push origin hotfix/critical-bug

# worktree 정리
git worktree remove ~/projects/app-hotfix
```

### 코드 리뷰

```bash
# PR 리뷰를 위해 해당 브랜치 체크아웃
git fetch origin pull/123/head:pr-123
git worktree add ~/reviews/pr-123 pr-123

# 리뷰...
cd ~/reviews/pr-123
# 테스트 실행, 코드 확인 등

# 리뷰 완료 후 정리
git worktree remove ~/reviews/pr-123
```

### 버전 비교

```bash
# 현재 버전과 이전 버전 동시 비교
git worktree add ~/versions/v1.0 v1.0.0
git worktree add ~/versions/v2.0 v2.0.0

# 두 버전 나란히 비교 가능
```

## 주의사항

> ⚠️ **같은 브랜치 중복 체크아웃 불가**
> 한 브랜치는 하나의 worktree에서만 체크아웃할 수 있습니다.

```bash
# 이미 main이 체크아웃되어 있으면 에러
git worktree add ../another-main main
# fatal: 'main' is already checked out at '...'
```

> ⚠️ **공유되는 것과 안 되는 것**

| 공유됨             | 공유 안 됨    |
| ------------------ | ------------- |
| 커밋, 브랜치, 태그 | 작업 디렉토리 |
| .git/config        | 스테이징 상태 |
| 원격 저장소 정보   | stash         |

> ⚠️ **정리 필수**
> 사용하지 않는 worktree는 정리하세요.

```bash
# 죽은 worktree 정리
git worktree prune
```

## Worktree vs Clone

| 구분      | Worktree           | Clone              |
| --------- | ------------------ | ------------------ |
| 저장 공간 | 적음 (객체 공유)   | 많음 (복사)        |
| 동기화    | 즉시 반영          | push/pull 필요     |
| 독립성    | 낮음 (같은 저장소) | 높음 (완전 분리)   |
| 용도      | 임시 작업          | 완전히 분리된 작업 |

## 팁

```bash
# worktree 락 (실수로 삭제 방지)
git worktree lock ../important-worktree

# 락 해제
git worktree unlock ../important-worktree

# worktree 이동
git worktree move ../old-path ../new-path

# 유용한 alias
git config --global alias.wa "worktree add"
git config --global alias.wl "worktree list"
git config --global alias.wr "worktree remove"
```

## 관련 문서

- [브랜치 기초](./05-git-branch-basics.md)
- [임시 저장 (stash)](./09-git-stash.md)

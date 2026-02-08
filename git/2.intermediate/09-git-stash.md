# 임시 저장 (stash)

## 개요

**git stash**는 작업 중인 변경사항을 임시로 저장하는 기능입니다.
브랜치를 전환하거나 다른 작업을 해야 할 때 현재 작업을 커밋하지 않고 저장해둘 수 있습니다.

## 기본 사용법

### stash 저장

```bash
# 현재 변경사항 임시 저장
git stash

# 메시지와 함께 저장
git stash save "작업 중인 기능"
# 또는 (권장)
git stash push -m "작업 중인 기능"

# 스테이징된 파일만 저장
git stash push --staged

# 추적되지 않는 파일도 포함
git stash -u
git stash --include-untracked

# 무시된 파일(gitignore)도 포함
git stash -a
git stash --all
```

### stash 목록 조회

```bash
# stash 목록 보기
git stash list

# 출력 예시
stash@{0}: WIP on main: a1b2c3d 마지막 커밋 메시지
stash@{1}: On main: 작업 중인 기능
stash@{2}: WIP on feature: e4f5g6h 다른 작업
```

### stash 내용 확인

```bash
# 최근 stash 변경 내용 보기
git stash show

# diff 형태로 보기
git stash show -p

# 특정 stash 보기
git stash show stash@{1}
git stash show -p stash@{1}
```

## stash 복원

### pop - 복원하고 삭제

```bash
# 최근 stash 복원 (stash 목록에서 삭제)
git stash pop

# 특정 stash 복원
git stash pop stash@{1}
```

### apply - 복원만 (삭제 안 함)

```bash
# 최근 stash 복원 (목록에 유지)
git stash apply

# 특정 stash 복원
git stash apply stash@{1}
```

### pop vs apply

| 명령    | 복원 | 목록에서 삭제 |
| ------- | ---- | ------------- |
| `pop`   | ✓    | ✓             |
| `apply` | ✓    | ✗             |

`apply`는 여러 브랜치에 같은 변경사항을 적용할 때 유용합니다.

## stash 삭제

```bash
# 특정 stash 삭제
git stash drop stash@{0}

# 모든 stash 삭제
git stash clear
```

## 고급 사용법

### 대화형 stash

```bash
# 변경사항 중 일부만 선택해서 stash
git stash push -p
```

선택지:

- `y`: 이 부분 stash에 저장
- `n`: 건너뛰기
- `s`: 더 작은 단위로 분할
- `q`: 종료

### stash에서 브랜치 생성

```bash
# stash 내용으로 새 브랜치 생성
git stash branch new-branch-name

# 특정 stash로 브랜치 생성
git stash branch new-branch stash@{1}
```

stash를 복원할 때 충돌이 발생하면 새 브랜치에서 해결하는 게 편합니다.

### 스테이징 상태 유지

```bash
# stash할 때 스테이징 상태 기억
git stash push --keep-index

# 복원할 때 스테이징 상태도 복원
git stash pop --index
```

## 실전 예시

### 긴급 버그 수정

```bash
# 현재 작업 저장
git stash push -m "feature: 진행 중인 기능"

# main 브랜치로 이동
git switch main

# 버그 수정
git switch -c hotfix/urgent-bug
# ... 수정 작업 ...
git commit -m "fix: 긴급 버그 수정"
git push

# 원래 브랜치로 복귀
git switch feature-branch

# 작업 복원
git stash pop
```

### 브랜치 전환 시

```bash
# 변경사항이 있는 상태에서 브랜치 전환
git switch other-branch
# error: 커밋되지 않은 변경사항이 있습니다

# stash로 해결
git stash
git switch other-branch
# 작업...
git switch original-branch
git stash pop
```

### 잘못된 브랜치에서 작업했을 때

```bash
# 현재 작업 stash
git stash

# 올바른 브랜치로 이동
git switch correct-branch

# stash 복원
git stash pop
```

## 주의사항

> ⚠️ **stash 충돌**
> stash pop/apply 시 충돌이 발생할 수 있습니다.
> 충돌 시 stash는 삭제되지 않습니다 (pop이어도).

```bash
# 충돌 해결 후
git add .
# stash 수동 삭제
git stash drop
```

> ⚠️ **stash는 임시 저장**
> 장기 보관용이 아닙니다.
> 중요한 작업은 커밋하거나 별도 브랜치에 저장하세요.

> ⚠️ **다른 브랜치의 stash**
> stash는 전역입니다. 어느 브랜치에서든 모든 stash에 접근 가능합니다.

## 팁

```bash
# 최신 stash 빠르게 보기
git stash show -p

# stash할 때 항상 메시지 쓰기 (alias)
git config --global alias.ss "stash push -m"
# 사용: git ss "작업 메시지"

# stash 개수 확인
git stash list | wc -l
```

## 관련 문서

- [브랜치 기초](./05-git-branch-basics.md)
- [되돌리기 (reset, revert)](./08-git-reset-revert.md)

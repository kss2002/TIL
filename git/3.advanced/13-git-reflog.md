# Reflog

## 개요

**git reflog**는 HEAD와 브랜치 참조가 변경된 모든 기록을 보여줍니다.
삭제된 커밋이나 잃어버린 작업을 복구하는 데 매우 유용합니다.

## 기본 사용법

```bash
# HEAD의 reflog 보기
git reflog

# 특정 브랜치의 reflog
git reflog show main

# 전체 reflog (더 자세히)
git reflog show --all
```

### 출력 예시

```bash
$ git reflog
a1b2c3d (HEAD -> main) HEAD@{0}: commit: feat: 새 기능
e4f5g6h HEAD@{1}: checkout: moving from feature to main
i7j8k9l HEAD@{2}: commit: fix: 버그 수정
m0n1o2p HEAD@{3}: reset: moving to HEAD~1
q3r4s5t HEAD@{4}: commit: 삭제된 커밋
```

## Reflog 참조 방식

```bash
HEAD@{0}     # 현재 HEAD
HEAD@{1}     # 1단계 전 HEAD
HEAD@{5}     # 5단계 전 HEAD
main@{0}     # 현재 main 브랜치
main@{1}     # 1단계 전 main 브랜치

# 시간 기반
HEAD@{yesterday}
HEAD@{1.week.ago}
HEAD@{2024-01-15}
main@{1.hour.ago}
```

## 삭제된 커밋 복구

### reset --hard로 삭제한 커밋 복구

```bash
# 실수로 커밋 삭제
git reset --hard HEAD~3

# reflog에서 삭제 전 상태 찾기
git reflog
# q3r4s5t HEAD@{1}: commit: 중요한 커밋

# 복구 방법 1: reset으로 되돌리기
git reset --hard HEAD@{1}
# 또는
git reset --hard q3r4s5t

# 복구 방법 2: 새 브랜치로 복구
git branch recovered q3r4s5t
```

### 삭제된 브랜치 복구

```bash
# 실수로 브랜치 삭제
git branch -D feature-important

# reflog에서 마지막 커밋 찾기
git reflog | grep feature
# 또는
git reflog

# 브랜치 재생성
git branch feature-important a1b2c3d
```

### Rebase 실패 복구

```bash
# rebase 전 상태 찾기
git reflog
# e4f5g6h HEAD@{5}: rebase (start): checkout main

# rebase 전으로 복구
git reset --hard HEAD@{5}
```

## Reflog 옵션

```bash
# 날짜 형식 포함
git reflog --date=iso

# 상대 시간 포함
git reflog --date=relative

# 특정 기간의 기록만
git reflog --since="2 weeks ago"

# 특정 동작만 필터링
git reflog --grep-reflog="commit"
git reflog --grep-reflog="reset"
```

## Reflog 만료 설정

reflog는 영원히 유지되지 않습니다.

```bash
# 만료 설정 확인
git config gc.reflogExpire       # 기본: 90일
git config gc.reflogExpireUnreachable  # 기본: 30일

# 만료 설정 변경
git config --global gc.reflogExpire "180 days"

# 수동으로 만료된 항목 정리
git reflog expire --expire=now --all
git gc
```

## 실전 예시

### 잘못된 rebase 되돌리기

```bash
# 1. rebase 전 상태 확인
git reflog
# a1b2c3d HEAD@{0}: rebase (finish): returning to refs/heads/main
# e4f5g6h HEAD@{7}: rebase (start): checkout develop
# i7j8k9l HEAD@{8}: commit: 이전 상태

# 2. rebase 시작 전으로 되돌리기
git reset --hard HEAD@{8}
```

### 강제 push 후 원격 상태 복구

```bash
# 로컬에서 원격의 이전 상태 찾기
git reflog
# 원격에서 받아왔던 시점 찾기

# 해당 커밋으로 브랜치 재설정
git reset --hard <이전-커밋>
git push --force-with-lease
```

### 잃어버린 stash 복구

```bash
# stash는 커밋이므로 reflog에 없지만
# dangling commit으로 찾을 수 있음
git fsck --lost-found

# 또는 stash reflog
git reflog stash
```

## git log vs git reflog

| 구분        | git log       | git reflog     |
| ----------- | ------------- | -------------- |
| 보여주는 것 | 커밋 히스토리 | HEAD 이동 기록 |
| 순서        | 조상 커밋 순  | 시간 순        |
| 삭제된 커밋 | 보이지 않음   | 보임           |
| 로컬/원격   | 원격과 공유   | 로컬만         |
| 용도        | 히스토리 조회 | 복구           |

## 주의사항

> ⚠️ **Reflog는 로컬 전용**
> reflog는 원격에 push되지 않습니다.
> 다른 개발자의 작업을 복구할 수 없습니다.

> ⚠️ **만료 기간**
> 도달 불가능한 커밋은 30일 후 가비지 컬렉션에 의해 삭제될 수 있습니다.

> ⚠️ **clone한 저장소**
> 새로 clone한 저장소에는 reflog가 없습니다.

## 팁

```bash
# 유용한 alias
git config --global alias.rl "reflog --date=relative"

# 특정 파일이 마지막으로 변경된 커밋
git log --follow -p -- filename.txt

# HEAD가 어디를 가리키는지 확인
git symbolic-ref HEAD

# 복구 전 확인
git show HEAD@{5}
```

## 관련 문서

- [되돌리기 (reset, revert)](./08-git-reset-revert.md)
- [로그 및 히스토리 조회](./04-git-log-history.md)
- [Rebase](./10-git-rebase.md)

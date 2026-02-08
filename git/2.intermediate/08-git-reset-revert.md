# 되돌리기 (reset, revert)

## 개요

Git에서 변경사항을 되돌리는 두 가지 주요 방법이 있습니다:

- **git reset**: 커밋을 삭제하듯이 되돌림 (히스토리 변경)
- **git revert**: 되돌리는 새 커밋을 생성 (히스토리 보존)

## git reset

커밋을 되돌리면서 히스토리를 변경합니다.

### 세 가지 모드

```
                    Working     Staging     Repository
                    Directory   Area        (commits)
                    ─────────   ─────────   ──────────
--soft              유지        유지        되돌림
--mixed (기본)      유지        되돌림      되돌림
--hard              되돌림      되돌림      되돌림
```

### --soft

커밋만 취소하고, 스테이징 상태는 유지합니다.

```bash
# 마지막 커밋 취소
git reset --soft HEAD~1

# 커밋 메시지 수정할 때 유용
git reset --soft HEAD~1
git commit -m "새로운 커밋 메시지"
```

### --mixed (기본값)

커밋과 스테이징을 취소하고, 작업 디렉토리는 유지합니다.

```bash
# 마지막 커밋 취소 (기본값)
git reset HEAD~1
git reset --mixed HEAD~1

# 스테이징만 취소
git reset HEAD file.txt
```

### --hard

모든 것을 되돌립니다. **작업 내용도 삭제됩니다!**

```bash
# 마지막 커밋 완전 삭제
git reset --hard HEAD~1

# 특정 커밋으로 되돌리기
git reset --hard a1b2c3d

# 원격 저장소 상태로 되돌리기
git reset --hard origin/main
```

### reset 대상 지정

```bash
# 상대 참조
HEAD~1      # 1개 전 커밋
HEAD~3      # 3개 전 커밋
HEAD^       # 부모 커밋 (HEAD~1과 동일)
HEAD^^      # 2개 전 (HEAD~2와 동일)

# 커밋 해시
git reset --hard a1b2c3d
```

### 실제 사용 예시

```bash
# 잘못된 커밋을 취소하고 다시 커밋
git reset --soft HEAD~1
# 파일 수정...
git add .
git commit -m "수정된 커밋"

# add 취소
git reset HEAD file.txt
# 또는 (Git 2.23+)
git restore --staged file.txt

# 모든 변경 폐기하고 이전 상태로
git reset --hard HEAD
```

## git revert

되돌리는 새 커밋을 생성합니다. 히스토리가 보존됩니다.

```
Before:  A ── B ── C ── D
After:   A ── B ── C ── D ── D'(D를 되돌림)
```

### 기본 사용법

```bash
# 마지막 커밋 되돌리기
git revert HEAD

# 특정 커밋 되돌리기
git revert a1b2c3d

# 되돌리기 커밋 메시지 수정 없이
git revert --no-edit HEAD

# 커밋하지 않고 되돌리기만
git revert --no-commit HEAD
```

### 여러 커밋 되돌리기

```bash
# 범위로 되돌리기 (오래된 것부터)
git revert HEAD~3..HEAD

# 여러 커밋 한번에 되돌리기
git revert --no-commit HEAD~3..HEAD
git commit -m "Revert last 3 commits"
```

### 머지 커밋 되돌리기

```bash
# 머지 커밋 되돌리기 (부모 지정 필요)
git revert -m 1 <merge-commit-hash>
# -m 1: 첫 번째 부모(머지된 브랜치) 기준으로 되돌림
```

## reset vs revert 비교

| 구분      | reset                  | revert           |
| --------- | ---------------------- | ---------------- |
| 히스토리  | 변경됨 (삭제)          | 보존됨 (새 커밋) |
| 협업 시   | 위험 (force push 필요) | 안전             |
| 사용 시점 | 로컬에서만 작업할 때   | 이미 push한 커밋 |
| 결과      | 깔끔한 히스토리        | 되돌림 기록 남음 |

### 언제 무엇을 사용할까?

```bash
# reset 사용 (로컬에서만)
- 아직 push 안 한 커밋
- 혼자 작업하는 브랜치
- 히스토리를 깔끔하게 유지하고 싶을 때

# revert 사용 (공유된 브랜치)
- 이미 push한 커밋
- 협업 중인 브랜치 (main, develop 등)
- 되돌리는 이유를 히스토리에 남기고 싶을 때
```

## 실수 복구하기

### reset --hard 실수로 했을 때

```bash
# reflog로 이전 상태 확인
git reflog

# 원하는 시점으로 복구
git reset --hard HEAD@{1}
```

### 삭제한 커밋 복구

```bash
# reflog에서 삭제된 커밋 찾기
git reflog

# 해당 커밋으로 브랜치 생성
git branch recovered-branch a1b2c3d

# 또는 cherry-pick
git cherry-pick a1b2c3d
```

## 주의사항

> ⚠️ **reset --hard 주의**
> 작업 중인 변경사항이 모두 삭제됩니다!
> 복구 불가능할 수 있으니 신중하게 사용하세요.

> ⚠️ **push한 커밋에 reset 사용 금지**
> 협업 시 다른 사람에게 문제가 발생합니다.
> 이미 push한 커밋은 revert를 사용하세요.

## 팁

```bash
# reset 전 백업 브랜치 생성
git branch backup-branch

# 작업 내용 임시 저장 후 reset
git stash
git reset --hard HEAD~1
git stash pop  # 필요시 복원
```

## 관련 문서

- [스테이징과 커밋](./03-git-staging-commit.md)
- [Reflog](./13-git-reflog.md)
- [Cherry-pick](./11-git-cherry-pick.md)

# Cherry-pick

## 개요

**git cherry-pick**은 다른 브랜치의 특정 커밋을 현재 브랜치에 적용하는 명령입니다.
전체 브랜치를 머지하지 않고 필요한 커밋만 가져올 수 있습니다.

## 기본 사용법

```bash
# 특정 커밋을 현재 브랜치에 적용
git cherry-pick <commit-hash>

# 예시
git cherry-pick a1b2c3d
```

### 작동 원리

```
Before:
main     ●───●───●

feature  ●───●───X───●
                 ↑
           이 커밋만 필요

After:
main     ●───●───●───X'
                      ↑
              cherry-pick된 커밋
```

## 여러 커밋 Cherry-pick

```bash
# 여러 커밋 (순서대로 적용)
git cherry-pick a1b2c3d e4f5g6h

# 범위 지정 (이전 커밋은 제외)
git cherry-pick a1b2c3d..e4f5g6h

# 범위 지정 (이전 커밋도 포함)
git cherry-pick a1b2c3d^..e4f5g6h
```

## 옵션

### 커밋하지 않기 (-n, --no-commit)

```bash
# 변경사항만 적용 (커밋 안 함)
git cherry-pick -n a1b2c3d

# 여러 커밋을 하나로 합치기
git cherry-pick -n a1b2c3d
git cherry-pick -n e4f5g6h
git commit -m "feat: 두 커밋의 변경사항 합침"
```

### 커밋 메시지 수정 (-e, --edit)

```bash
# 커밋 메시지를 수정하며 적용
git cherry-pick -e a1b2c3d
```

### 원본 커밋 정보 추가 (-x)

```bash
# 원본 커밋 해시를 메시지에 추가
git cherry-pick -x a1b2c3d

# 결과 메시지 예시:
# feat: 새 기능
#
# (cherry picked from commit a1b2c3d...)
```

### Signed-off-by 추가 (-s)

```bash
git cherry-pick -s a1b2c3d

# 결과:
# feat: 새 기능
#
# Signed-off-by: Your Name <your.email@example.com>
```

## 충돌 해결

```bash
# cherry-pick 중 충돌 발생 시
# 1. 충돌 파일 수정
# 2. 스테이징
git add .
# 3. cherry-pick 계속
git cherry-pick --continue

# cherry-pick 중단
git cherry-pick --abort

# 현재 커밋 건너뛰기
git cherry-pick --skip
```

## 활용 사례

### 1. 핫픽스 백포트

production 브랜치의 버그 수정을 develop에도 적용

```bash
# main에서 버그 수정
git switch main
git commit -m "fix: 중요 버그 수정"  # a1b2c3d

# develop에도 적용
git switch develop
git cherry-pick a1b2c3d
```

### 2. 잘못된 브랜치에서 작업한 커밋 이동

```bash
# 실수로 main에서 작업함
git log --oneline
# a1b2c3d (HEAD -> main) feat: 새 기능

# 올바른 feature 브랜치로 이동
git switch feature-branch
git cherry-pick a1b2c3d

# main에서 해당 커밋 제거
git switch main
git reset --hard HEAD~1
```

### 3. 릴리스 브랜치에 특정 기능만 포함

```bash
# develop의 특정 커밋만 release에 포함
git switch release/1.0
git cherry-pick a1b2c3d  # 필요한 기능
git cherry-pick e4f5g6h  # 필요한 수정
# 나머지 커밋은 제외
```

### 4. 다른 저장소에서 커밋 가져오기

```bash
# 다른 원격 저장소 추가
git remote add upstream https://github.com/original/repo.git
git fetch upstream

# 특정 커밋 cherry-pick
git cherry-pick <upstream-commit-hash>
```

## 머지 커밋 Cherry-pick

머지 커밋은 부모가 둘이므로 `-m` 옵션으로 부모를 지정해야 합니다.

```bash
# -m 1: 첫 번째 부모 기준 (보통 main 브랜치)
git cherry-pick -m 1 <merge-commit-hash>

# -m 2: 두 번째 부모 기준 (머지된 브랜치)
git cherry-pick -m 2 <merge-commit-hash>
```

## 주의사항

> ⚠️ **중복 커밋 주의**
> 같은 변경사항을 cherry-pick하면 나중에 머지할 때 충돌이 발생할 수 있습니다.

> ⚠️ **의존 관계 있는 커밋**
> 커밋이 이전 커밋에 의존하는 경우, 관련 커밋을 모두 cherry-pick 해야 합니다.

```bash
# A → B → C 순서로 의존 관계가 있다면
git cherry-pick A B C  # 순서대로
```

> ⚠️ **커밋 해시 변경**
> cherry-pick된 커밋은 새로운 해시를 가집니다 (내용은 같지만 부모가 다르므로).

## Cherry-pick vs Merge vs Rebase

| 상황                   | 권장 방법   |
| ---------------------- | ----------- |
| 특정 커밋 1-2개만 필요 | Cherry-pick |
| 브랜치 전체 통합       | Merge       |
| 히스토리 정리          | Rebase      |

## 팁

```bash
# 유용한 alias
git config --global alias.cp "cherry-pick"
git config --global alias.cpn "cherry-pick -n"

# 커밋 찾기
git log --oneline --all --graph | grep "찾을내용"

# cherry-pick할 커밋 미리 확인
git show a1b2c3d
```

## 관련 문서

- [Rebase](./10-git-rebase.md)
- [되돌리기 (reset, revert)](./08-git-reset-revert.md)
- [로그 및 히스토리 조회](./04-git-log-history.md)

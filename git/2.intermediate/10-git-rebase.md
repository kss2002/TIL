# Rebase

## 개요

**git rebase**는 한 브랜치의 커밋들을 다른 브랜치 위로 재배치(re-base)하는 명령입니다.
히스토리를 깔끔하게 정리할 때 사용합니다.

## Rebase vs Merge

### Merge의 결과

```
         ●───●───●  feature
        /         \
●───●───●───●──────●  main (merge commit)
```

### Rebase의 결과

```
●───●───●───●───●'──●'──●'  main
              ↑
     feature commits가 main 위로 재배치
```

## 기본 Rebase

```bash
# feature 브랜치에서 main을 기준으로 rebase
git switch feature
git rebase main

# 결과: feature의 커밋들이 main의 최신 커밋 위로 이동
```

### 과정 설명

```
Before:
          C1───C2  feature
         /
A───B───D───E  main

After (git rebase main):
                    C1'──C2'  feature
                   /
A───B───D───E    main
```

## Interactive Rebase

가장 강력한 기능입니다. 커밋을 수정, 합치기, 순서 변경 등을 할 수 있습니다.

### 시작하기

```bash
# 최근 3개 커밋 대상
git rebase -i HEAD~3

# 특정 커밋부터
git rebase -i a1b2c3d
```

### 에디터 화면

```
pick a1b2c3d feat: 기능 A 추가
pick e4f5g6h feat: 기능 B 추가
pick i7j8k9l fix: 오타 수정

# Commands:
# p, pick = 커밋 사용
# r, reword = 커밋 사용, 메시지 수정
# e, edit = 커밋 사용, 수정을 위해 멈춤
# s, squash = 이전 커밋과 합치기 (메시지 유지)
# f, fixup = squash와 같지만 메시지 버림
# d, drop = 커밋 삭제
```

### 주요 명령어

| 명령     | 설명               | 사용 예            |
| -------- | ------------------ | ------------------ |
| `pick`   | 그대로 사용        | 기본값             |
| `reword` | 메시지만 수정      | 오타 수정          |
| `edit`   | 커밋 내용 수정     | 파일 변경          |
| `squash` | 이전 커밋과 합침   | 관련 커밋 정리     |
| `fixup`  | 합치고 메시지 버림 | 사소한 수정 합치기 |
| `drop`   | 커밋 삭제          | 불필요한 커밋 제거 |

### 사용 예시

#### 커밋 메시지 수정

```bash
git rebase -i HEAD~3

# 에디터에서 pick을 reword로 변경
reword a1b2c3d feat: 기능 A 추가
pick e4f5g6h feat: 기능 B 추가

# 저장 후 메시지 수정 에디터가 열림
```

#### 커밋 합치기 (Squash)

```bash
git rebase -i HEAD~3

# 하위 커밋들을 첫 번째에 합치기
pick a1b2c3d feat: 새 기능 추가
squash e4f5g6h feat: 기능 보완
squash i7j8k9l fix: 버그 수정

# 저장 후 합쳐진 커밋 메시지 작성
```

#### 커밋 순서 변경

```bash
git rebase -i HEAD~3

# 줄 순서를 변경하면 커밋 순서도 변경됨
pick i7j8k9l fix: 버그 수정
pick a1b2c3d feat: 새 기능 추가
pick e4f5g6h feat: 기능 보완
```

## Rebase 충돌 해결

```bash
# rebase 중 충돌 발생 시
# 1. 충돌 파일 수정
# 2. 스테이징
git add .
# 3. rebase 계속
git rebase --continue

# rebase 중단
git rebase --abort

# 현재 커밋 건너뛰기
git rebase --skip
```

## Rebase onto

더 세밀한 rebase가 가능합니다.

```bash
# 특정 범위의 커밋만 다른 브랜치로 이동
git rebase --onto main server client
```

```
Before:
          ●───●───●  client
         /
    ●───●  server
   /
●───●───●  main

After:
              ●───●───●  client
             /
●───●───●───●  main
   \
    ●───●  server (변화 없음)
```

## Autosquash

자동으로 fixup/squash를 정렬합니다.

```bash
# fixup 커밋 생성
git commit --fixup=a1b2c3d
# 또는
git commit --squash=a1b2c3d

# rebase 시 자동 정렬
git rebase -i --autosquash HEAD~5
```

## Pull with Rebase

```bash
# merge 대신 rebase로 pull
git pull --rebase origin main

# 기본값으로 설정
git config --global pull.rebase true
```

## 주의사항

> ⚠️ **황금률: 이미 push한 커밋은 rebase 하지 않는다**
> 공유된 커밋을 rebase하면 협업하는 다른 개발자에게 문제가 발생합니다.

```bash
# 개인 브랜치에서만 rebase
# public 브랜치(main, develop)에서는 merge 사용
```

> ⚠️ **Force push 필요**
> rebase 후에는 히스토리가 변경되어 force push가 필요합니다.

```bash
# 안전한 force push
git push --force-with-lease origin feature
```

## Rebase vs Merge: 언제 무엇을?

### Rebase 사용

```bash
- feature 브랜치를 main의 최신 커밋으로 업데이트할 때
- PR 전 커밋 정리할 때
- 깔끔한 선형 히스토리를 원할 때
```

### Merge 사용

```bash
- main 브랜치에 feature 머지할 때
- 협업 중인 공유 브랜치
- 머지 이력을 남기고 싶을 때
```

## 팁

```bash
# 유용한 alias
git config --global alias.ri "rebase -i"
git config --global alias.rc "rebase --continue"
git config --global alias.ra "rebase --abort"

# 사용
git ri HEAD~5

# rebase 전 백업
git branch backup-before-rebase
```

## 관련 문서

- [머지(병합)](./06-git-merge.md)
- [Cherry-pick](./11-git-cherry-pick.md)
- [Git Flow 전략](./18-git-flow.md)

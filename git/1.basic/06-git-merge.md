# 머지(병합)

## 개요

**머지(Merge)**는 두 개 이상의 브랜치를 하나로 합치는 작업입니다. 브랜치에서 작업한 내용을 다른 브랜치(보통 main)에 통합할 때 사용합니다.

## 머지 방식

### 1. Fast-forward Merge

메인 브랜치에 새 커밋이 없을 때 단순히 포인터만 이동합니다.

```
Before:
main     ●───●───●
                  \
feature            ●───●

After:
main     ●───●───●───●───●
                          ↑ HEAD
```

```bash
git switch main
git merge feature
# Fast-forward
```

### 2. 3-way Merge (Recursive)

메인 브랜치에도 새 커밋이 있을 때 새로운 **머지 커밋**이 생성됩니다.

```
Before:
                  main
                    ↓
         ●───●───●───●
        /
●───●───●
         \
          ●───●───●
                  ↑
               feature

After:
         ●───●───●───●───●
        /                 \
●───●───●                  ●  ← 머지 커밋
         \                /
          ●───●───●───●──●
```

```bash
git switch main
git merge feature
# 자동으로 머지 커밋 생성
```

## 기본 머지

```bash
# main 브랜치로 이동
git switch main

# feature 브랜치를 main에 머지
git merge feature

# 머지 커밋 메시지 지정
git merge feature -m "Merge feature into main"
```

## 머지 옵션

```bash
# Fast-forward가 가능해도 머지 커밋 생성
git merge --no-ff feature

# Fast-forward만 허용 (불가능하면 실패)
git merge --ff-only feature

# 머지하지 않고 결과만 미리보기
git merge --no-commit feature

# 스쿼시 머지 (모든 커밋을 하나로)
git merge --squash feature
```

### --no-ff 사용 이유

```bash
# Fast-forward (히스토리가 선형)
git merge feature
# 결과: main ●───●───●───●───●

# no-ff (브랜치 히스토리 보존)
git merge --no-ff feature
# 결과: main ●───●───●───●
#               \       /
#                ●───●
```

`--no-ff`는 feature 브랜치가 존재했다는 것을 히스토리에 남깁니다.

## 충돌 (Conflict)

두 브랜치에서 같은 파일의 같은 부분을 수정했을 때 충돌이 발생합니다.

### 충돌 발생 시

```bash
$ git merge feature
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

### 충돌 파일 형식

```
<<<<<<< HEAD
현재 브랜치(main)의 내용
=======
머지하려는 브랜치(feature)의 내용
>>>>>>> feature
```

### 충돌 해결 순서

```bash
# 1. 충돌 파일 확인
git status

# 2. 파일을 열어서 수동으로 수정
#    <<<<<<, =======, >>>>>> 마커 제거
#    원하는 내용으로 수정

# 3. 수정 완료 후 스테이징
git add file.txt

# 4. 머지 커밋 완료
git commit
# 또는 메시지 지정
git commit -m "Merge feature with conflict resolution"
```

### 머지 중단

```bash
# 머지 취소하고 이전 상태로
git merge --abort
```

## 충돌 해결 도구

### VS Code에서 충돌 해결

VS Code는 충돌 발생 시 다음 옵션을 제공합니다:

- **Accept Current Change**: 현재 브랜치 내용 사용
- **Accept Incoming Change**: 머지하려는 브랜치 내용 사용
- **Accept Both Changes**: 둘 다 유지
- **Compare Changes**: 변경 내용 비교

### Git mergetool

```bash
# 머지 도구 설정
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'

# 충돌 시 머지 도구 실행
git mergetool
```

## 스쿼시 머지 (Squash Merge)

여러 커밋을 하나로 합쳐서 머지합니다.

```bash
git merge --squash feature
git commit -m "feat: 새 기능 추가"
```

```
Before:
feature  ●───●───●───●  (4개의 커밋)

After (squash merge):
main     ●───●───●  (1개의 새 커밋)
```

**사용 시점**: feature 브랜치의 커밋 히스토리가 지저분할 때

## 실전 예시: PR 머지

```bash
# 1. 최신 main 가져오기
git switch main
git pull origin main

# 2. feature 브랜치로 이동
git switch feature/new-feature

# 3. main을 feature에 먼저 머지 (충돌 확인)
git merge main

# 4. 충돌 있으면 해결

# 5. 테스트

# 6. main으로 돌아가서 머지
git switch main
git merge --no-ff feature/new-feature

# 7. 푸시
git push origin main
```

## 주의사항

> ⚠️ **머지 전 작업 상태 확인**
> `git status`로 커밋 안 된 변경사항이 없는지 확인하세요.

> ⚠️ **최신 상태 유지**
> 머지 전 `git pull`로 최신 코드를 받아오세요.

> ⚠️ **충돌 해결 시 테스트**
> 충돌 해결 후 반드시 테스트해서 정상 동작 확인하세요.

## 팁

```bash
# 머지 커밋 히스토리에서 찾기
git log --merges

# 특정 브랜치가 main에 머지됐는지 확인
git branch --merged main

# 아직 머지 안 된 브랜치 확인
git branch --no-merged main
```

## 관련 문서

- [브랜치 기초](./05-git-branch-basics.md)
- [Rebase](./10-git-rebase.md)
- [Git Flow 전략](./18-git-flow.md)

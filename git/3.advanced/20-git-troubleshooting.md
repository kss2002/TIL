# 문제 해결 가이드

## 개요

Git을 사용하다 보면 다양한 문제 상황을 마주하게 됩니다.
이 문서에서는 자주 발생하는 문제와 해결 방법을 정리합니다.

## 커밋 관련

### 마지막 커밋 메시지 수정

```bash
git commit --amend -m "새로운 메시지"

# 에디터로 수정
git commit --amend
```

### 마지막 커밋에 파일 추가

```bash
git add forgotten-file.txt
git commit --amend --no-edit
```

### 커밋 취소 (변경사항 유지)

```bash
# 스테이징 유지
git reset --soft HEAD~1

# 스테이징 해제
git reset HEAD~1
```

### 커밋 완전 삭제

```bash
git reset --hard HEAD~1
```

> ⚠️ 이미 push한 커밋은 `git revert` 사용 권장

### 중간 커밋 수정

```bash
git rebase -i HEAD~3
# edit으로 변경 후 저장
git commit --amend
git rebase --continue
```

## 스테이징 관련

### 스테이징 취소

```bash
# 특정 파일
git restore --staged file.txt

# 모든 파일
git restore --staged .
```

### 실수로 add한 파일 제거

```bash
# 스테이징에서만 제거 (파일 유지)
git reset HEAD file.txt
# 또는
git restore --staged file.txt
```

## 변경사항 관련

### 작업 내용 폐기

```bash
# 특정 파일
git restore file.txt

# 모든 파일
git restore .
git checkout -- .
```

### 삭제한 파일 복구

```bash
# 커밋 전이라면
git restore deleted-file.txt

# 커밋 후라면
git checkout HEAD~1 -- deleted-file.txt
```

### 특정 커밋의 파일로 복구

```bash
git checkout a1b2c3d -- file.txt
```

## 브랜치 관련

### 잘못된 브랜치에서 작업함

```bash
# 아직 커밋 안 했다면
git stash
git switch correct-branch
git stash pop

# 이미 커밋했다면
git switch correct-branch
git cherry-pick <commit-hash>
git switch wrong-branch
git reset --hard HEAD~1
```

### 삭제한 브랜치 복구

```bash
# reflog에서 찾기
git reflog | grep "브랜치명"

# 브랜치 재생성
git branch branch-name <commit-hash>
```

### 브랜치명 변경

```bash
# 현재 브랜치
git branch -m new-name

# 다른 브랜치
git branch -m old-name new-name

# 원격 반영
git push origin :old-name new-name
git push -u origin new-name
```

## 머지 관련

### 머지 충돌 해결

```bash
# 충돌 파일 확인
git status

# 파일 수정 후
git add .
git commit

# 머지 취소
git merge --abort
```

### 머지 취소

```bash
# 머지 커밋 이전으로
git reset --hard HEAD~1

# 이미 push했다면
git revert -m 1 <merge-commit>
```

### Fast-forward 머지 되돌리기

```bash
# reflog에서 머지 전 상태 찾기
git reflog
git reset --hard HEAD@{1}
```

## 원격 저장소 관련

### Push 거부됨 (non-fast-forward)

```bash
# 원격 변경사항 가져오기
git pull --rebase origin main

# 또는 강제 push (주의!)
git push --force-with-lease origin main
```

### 원격 브랜치 삭제

```bash
git push origin --delete branch-name
```

### 원격 URL 변경

```bash
git remote set-url origin https://new-url.git
```

### 원격의 변경사항 강제로 받기

```bash
# 로컬 변경사항 폐기
git fetch origin
git reset --hard origin/main
```

## 대용량 파일 관련

### 실수로 대용량 파일 커밋

```bash
# 아직 push 안 했다면
git reset HEAD~1
# .gitignore 추가 후 다시 커밋

# 히스토리에서 완전히 제거
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/large-file' \
  --prune-empty --tag-name-filter cat -- --all
```

### push 용량 초과

```bash
# Git LFS 사용
git lfs install
git lfs track "*.psd"
git add .gitattributes
```

## Git 상태 이상

### Detached HEAD

```bash
# 현재 상태로 브랜치 생성
git switch -c new-branch

# 기존 브랜치로 돌아가기
git switch main
```

### HEAD가 손상됨

```bash
# reflog로 복구
git reflog
git reset --hard HEAD@{1}
```

### .git 폴더 손상

```bash
# 원격에서 다시 clone
git clone <url>

# 작업 중인 파일 복사
```

## 인증 관련

### 인증 정보 캐시 삭제

```bash
# macOS
git credential-osxkeychain erase

# Windows
git credential-manager-core erase

# 캐시 삭제
git config --global --unset credential.helper
```

### SSH 연결 문제

```bash
# SSH 테스트
ssh -T git@github.com

# SSH 에이전트 재시작
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

## 성능 관련

### 저장소가 너무 느림

```bash
# 가비지 컬렉션
git gc

# 공격적 정리
git gc --aggressive --prune=now

# 얕은 clone
git clone --depth 1 <url>
```

### 히스토리가 너무 큼

```bash
# 특정 깊이까지만 유지
git clone --depth 100 <url>

# 최근 히스토리만 가져오기
git fetch --depth 100
```

## 기타

### .gitignore가 작동 안 함

```bash
# 이미 추적 중인 파일은 무시되지 않음
git rm -r --cached .
git add .
git commit -m "fix: .gitignore 적용"
```

### 파일 권한 변경이 감지됨

```bash
# 권한 변경 무시
git config core.fileMode false
```

### CRLF 경고

```bash
# 줄바꿈 자동 변환
git config --global core.autocrlf true  # Windows
git config --global core.autocrlf input # Mac/Linux
```

## 복구의 황금률

1. **일단 멈추고 상황 파악**: `git status`, `git log`
2. **reflog 확인**: `git reflog`
3. **강제 명령 전 백업**: `git branch backup`
4. **push 전 로컬에서 해결**

```bash
# 거의 모든 것을 복구할 수 있는 명령어
git reflog
git reset --hard <원하는-상태>
```

## 관련 문서

- [되돌리기 (reset, revert)](./08-git-reset-revert.md)
- [Reflog](./13-git-reflog.md)
- [머지(병합)](./06-git-merge.md)

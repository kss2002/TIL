# 원격 저장소

## 개요

**원격 저장소(Remote Repository)**는 네트워크 상에 위치한 Git 저장소입니다.
GitHub, GitLab, Bitbucket 등의 서비스를 통해 호스팅됩니다.
원격 저장소를 통해 다른 개발자와 협업할 수 있습니다.

## git remote - 원격 저장소 관리

### 원격 저장소 조회

```bash
# 원격 저장소 목록
git remote

# URL 포함 조회
git remote -v

# 상세 정보
git remote show origin
```

### 출력 예시

```bash
$ git remote -v
origin  https://github.com/username/repo.git (fetch)
origin  https://github.com/username/repo.git (push)
```

### 원격 저장소 추가

```bash
# 원격 저장소 추가
git remote add origin https://github.com/username/repo.git

# 여러 원격 저장소 추가 가능
git remote add upstream https://github.com/original/repo.git
```

### 원격 저장소 수정/삭제

```bash
# URL 변경
git remote set-url origin https://github.com/username/new-repo.git

# 이름 변경
git remote rename origin main-repo

# 삭제
git remote remove upstream
```

## git push - 원격에 업로드

로컬 커밋을 원격 저장소에 업로드합니다.

### 기본 사용법

```bash
# 기본 푸시
git push origin main

# 현재 브랜치 푸시
git push origin HEAD

# 모든 브랜치 푸시
git push --all origin

# 태그 푸시
git push origin v1.0.0
git push origin --tags
```

### 업스트림 설정 (-u)

```bash
# 업스트림 설정과 함께 푸시
git push -u origin main
# 또는
git push --set-upstream origin main

# 이후에는 간단히
git push
```

### 강제 푸시

```bash
# 강제 푸시 (위험!)
git push --force origin main
git push -f origin main

# 안전한 강제 푸시 (권장)
git push --force-with-lease origin main
```

> ⚠️ `--force`는 원격 히스토리를 덮어씁니다. 협업 시 다른 사람의 작업을 날릴 수 있습니다.
> `--force-with-lease`는 다른 사람이 푸시한 것이 있으면 실패합니다.

## git pull - 원격에서 가져오기 + 머지

원격 저장소의 변경사항을 가져와서 현재 브랜치에 머지합니다.

```bash
# 기본 pull (fetch + merge)
git pull origin main

# 업스트림 설정되어 있으면
git pull

# rebase로 pull
git pull --rebase origin main

# 항상 rebase로 pull 설정
git config --global pull.rebase true
```

### Pull = Fetch + Merge

```bash
# git pull은 아래 두 명령을 합친 것
git fetch origin
git merge origin/main
```

## git fetch - 원격에서 가져오기만

원격 저장소의 변경사항을 가져오지만 머지하지 않습니다.

```bash
# 특정 원격의 모든 브랜치 가져오기
git fetch origin

# 모든 원격 저장소에서 가져오기
git fetch --all

# 삭제된 원격 브랜치 정리
git fetch --prune
# 또는
git fetch -p
```

### Fetch 후 확인

```bash
# 원격 브랜치 상태 확인
git branch -r

# 로컬과 원격 비교
git log main..origin/main

# 원격 변경사항 확인 후 머지
git fetch origin
git diff main origin/main
git merge origin/main
```

## 원격 브랜치 관리

### 원격 브랜치 체크아웃

```bash
# 원격 브랜치를 로컬에 체크아웃
git checkout -b feature origin/feature
# 또는
git switch -c feature origin/feature

# Git 2.23+ 자동 추적
git switch feature  # origin/feature 자동 추적
```

### 원격 브랜치 삭제

```bash
# 원격 브랜치 삭제
git push origin --delete feature
# 또는
git push origin :feature

# 로컬에서 삭제된 원격 브랜치 정리
git remote prune origin
# 또는
git fetch --prune
```

### 원격 브랜치 추적 관계

```bash
# 현재 브랜치의 추적 브랜치 확인
git status -sb

# 모든 추적 관계 확인
git branch -vv

# 추적 브랜치 설정
git branch -u origin/main
# 또는
git branch --set-upstream-to=origin/main
```

## SSH vs HTTPS

### HTTPS

```bash
# URL 형식
https://github.com/username/repo.git

# 장점: 설정 간단
# 단점: 매번 인증 필요 (Credential Helper로 해결 가능)

# Credential 저장
git config --global credential.helper store
```

### SSH

```bash
# URL 형식
git@github.com:username/repo.git

# 장점: 한 번 설정하면 인증 불필요
# 설정 필요: SSH 키 생성 및 등록

# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# 공개 키 확인 (GitHub에 등록)
cat ~/.ssh/id_ed25519.pub
```

## 실전 예시

### 프로젝트 시작하기

```bash
# 1. GitHub에서 저장소 생성

# 2. 로컬 저장소 초기화
git init
git add .
git commit -m "Initial commit"

# 3. 원격 저장소 연결
git remote add origin https://github.com/username/repo.git

# 4. main 브랜치로 이름 변경 (필요시)
git branch -M main

# 5. 푸시
git push -u origin main
```

### 협업 플로우

```bash
# 1. 최신 변경사항 가져오기
git fetch origin

# 2. 확인
git log main..origin/main --oneline

# 3. 머지
git pull origin main
# 또는 rebase
git pull --rebase origin main

# 4. 작업 후 푸시
git push origin main
```

## 주의사항

> ⚠️ **push 전 pull 먼저**
> 충돌을 줄이기 위해 push 전에 항상 pull 하세요.

> ⚠️ **force push는 협업 시 금지**
> 다른 사람의 작업을 덮어쓸 수 있습니다.

## 팁

```bash
# 유용한 alias
git config --global alias.pf "push --force-with-lease"
git config --global alias.pl "pull --rebase"

# 원격 URL 확인/변경
git remote -v
git remote set-url origin <new-url>
```

## 관련 문서

- [저장소 생성 및 복제](./02-git-init-clone.md)
- [브랜치 기초](./05-git-branch-basics.md)
- [Git 설정](./19-git-config.md)

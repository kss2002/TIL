# 로그 및 히스토리 조회

## 개요

Git은 모든 변경 이력을 저장합니다. `git log`, `git show`, `git diff` 명령어로 이력을 조회할 수 있습니다.

## git log - 커밋 이력 조회

### 기본 사용법

```bash
# 전체 로그 보기
git log

# 한 줄로 보기
git log --oneline

# 최근 N개만 보기
git log -n 5
git log -5
```

### 출력 예시

```bash
$ git log --oneline
a1b2c3d (HEAD -> main) feat: 새 기능 추가
e4f5g6h fix: 버그 수정
i7j8k9l docs: README 수정
m0n1o2p Initial commit
```

### 유용한 옵션들

```bash
# 그래프로 보기
git log --graph

# 그래프 + 한 줄 + 모든 브랜치
git log --graph --oneline --all

# 변경된 파일 목록 포함
git log --stat

# 변경 내용(diff) 포함
git log -p

# 특정 파일의 이력
git log -- filename.txt

# 특정 작성자의 커밋
git log --author="username"

# 날짜 범위
git log --since="2024-01-01" --until="2024-12-31"
git log --after="2024-01-01"
git log --before="2024-12-31"

# 커밋 메시지로 검색
git log --grep="keyword"

# 코드 변경 내용으로 검색 (pickaxe)
git log -S "함수명"
```

### 포맷 커스터마이징

```bash
# 커스텀 포맷
git log --pretty=format:"%h - %an, %ar : %s"

# 포맷 옵션
# %h  - 짧은 커밋 해시
# %H  - 전체 커밋 해시
# %an - 작성자 이름
# %ae - 작성자 이메일
# %ar - 상대적 작성 시간
# %ad - 작성 날짜
# %s  - 커밋 메시지 제목
# %b  - 커밋 메시지 본문
```

### 예쁜 로그 보기

```bash
# alias 설정 추천
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 사용
git lg
```

## git show - 커밋 상세 정보

```bash
# 최신 커밋 상세 보기
git show

# 특정 커밋 보기
git show a1b2c3d

# 특정 커밋의 특정 파일
git show a1b2c3d:src/main.js

# 태그 정보 보기
git show v1.0.0
```

## git diff - 변경 사항 비교

### Working Directory vs Staging Area

```bash
# 스테이징 전 변경사항
git diff
```

### Staging Area vs Last Commit

```bash
# 스테이징된 변경사항
git diff --staged
# 또는
git diff --cached
```

### 커밋 간 비교

```bash
# 두 커밋 비교
git diff commit1 commit2

# 최신 커밋과 비교
git diff HEAD~1 HEAD

# 브랜치 간 비교
git diff main develop

# 특정 파일만 비교
git diff main develop -- src/app.js
```

### 변경 통계

```bash
# 파일별 변경 통계
git diff --stat

# 변경된 파일 목록만
git diff --name-only

# 변경 상태와 함께
git diff --name-status
```

## git blame - 라인별 작성자 확인

```bash
# 파일의 각 라인 작성자 확인
git blame filename.txt

# 특정 라인 범위만
git blame -L 10,20 filename.txt

# 이메일 표시
git blame -e filename.txt
```

### 출력 예시

```bash
$ git blame README.md
a1b2c3d4 (John Doe 2024-01-15) # Project Title
e5f6g7h8 (Jane Kim 2024-01-20)
i9j0k1l2 (John Doe 2024-01-25) ## Installation
```

## git shortlog - 작성자별 요약

```bash
# 작성자별 커밋 수
git shortlog -sn

# 작성자별 커밋 목록
git shortlog

# 이메일 포함
git shortlog -sne
```

## 조회 팁

### 특정 기간의 작업 확인

```bash
# 오늘 작업한 내용
git log --since="midnight" --oneline

# 이번 주 작업
git log --since="1 week ago" --oneline

# 특정 사용자의 최근 작업
git log --author="username" --since="1 week ago" --oneline
```

### 머지 커밋 제외

```bash
git log --no-merges
```

### 파일 변경 추적

```bash
# 파일이 언제 삭제되었는지
git log --all --full-history -- deleted-file.txt

# 파일 이름 변경 추적
git log --follow -- current-name.txt
```

## 주의사항

> ⚠️ **git log -p 주의**
> 대량의 변경이 있으면 출력이 매우 길어집니다.
> `git log -p -5` 처럼 개수를 제한하세요.

## 관련 문서

- [스테이징과 커밋](./03-git-staging-commit.md)
- [되돌리기 (reset, revert)](./08-git-reset-revert.md)
- [Reflog](./13-git-reflog.md)

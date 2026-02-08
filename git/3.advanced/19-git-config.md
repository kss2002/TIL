# Git 설정

## 개요

Git 설정은 세 가지 수준으로 관리됩니다:

- **System**: 모든 사용자, 모든 저장소
- **Global**: 현재 사용자, 모든 저장소
- **Local**: 현재 저장소만

## 설정 위치

```bash
# System
/etc/gitconfig

# Global
~/.gitconfig
~/.config/git/config

# Local
.git/config
```

우선순위: **Local > Global > System**

## 설정 조회

```bash
# 모든 설정 보기
git config --list

# 특정 수준만 보기
git config --global --list
git config --local --list

# 특정 설정 값 보기
git config user.name
git config user.email

# 설정이 어디서 왔는지 확인
git config --show-origin user.name
```

## 필수 설정

### 사용자 정보

```bash
# 전역 설정 (모든 저장소)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 저장소별 설정 (회사/개인 구분)
git config --local user.email "work@company.com"
```

### 에디터 설정

```bash
# VS Code
git config --global core.editor "code --wait"

# Vim
git config --global core.editor "vim"

# Nano
git config --global core.editor "nano"

# Sublime Text
git config --global core.editor "subl -n -w"
```

## 유용한 설정

### 줄바꿈 처리

```bash
# Windows에서 작업 시
git config --global core.autocrlf true

# Mac/Linux
git config --global core.autocrlf input
```

### 기본 브랜치 이름

```bash
# main을 기본 브랜치로
git config --global init.defaultBranch main
```

### Pull 전략

```bash
# rebase로 pull (권장)
git config --global pull.rebase true

# 또는 merge로 pull
git config --global pull.rebase false
```

### Push 설정

```bash
# 현재 브랜치만 push
git config --global push.default current

# 업스트림 브랜치와 같은 이름으로
git config --global push.default simple
```

### 색상 출력

```bash
# 색상 활성화
git config --global color.ui auto
```

### 대소문자 구분

```bash
# 파일명 대소문자 변경 감지
git config core.ignorecase false
```

## Alias (단축 명령)

### 인기 alias

```bash
# 상태
git config --global alias.st "status"
git config --global alias.ss "status -s"

# 로그
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.ll "log --oneline -10"
git config --global alias.last "log -1 HEAD"

# 브랜치
git config --global alias.br "branch"
git config --global alias.co "checkout"
git config --global alias.sw "switch"

# 커밋
git config --global alias.cm "commit -m"
git config --global alias.ca "commit --amend"
git config --global alias.can "commit --amend --no-edit"

# 차이
git config --global alias.df "diff"
git config --global alias.dfs "diff --staged"

# Unstage
git config --global alias.unstage "reset HEAD --"

# 기타
git config --global alias.aliases "config --get-regexp alias"
```

### 복잡한 alias

```bash
# 예쁜 로그
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 오늘 작업 내역
git config --global alias.today "log --since=midnight --oneline --author='Your Name'"

# 변경된 파일 목록
git config --global alias.changed "diff --name-only"
```

### 사용

```bash
# git status 대신
git st

# git log --oneline -10 대신
git ll
```

## .gitconfig 직접 편집

```bash
# 에디터로 열기
git config --global --edit
```

### ~/.gitconfig 예시

```ini
[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = code --wait
    autocrlf = input

[init]
    defaultBranch = main

[pull]
    rebase = true

[push]
    default = current

[alias]
    st = status
    co = checkout
    br = branch
    cm = commit -m
    lg = log --oneline --graph --all
    ll = log --oneline -10

[color]
    ui = auto

[diff]
    tool = vscode

[difftool "vscode"]
    cmd = code --wait --diff $LOCAL $REMOTE

[merge]
    tool = vscode

[mergetool "vscode"]
    cmd = code --wait $MERGED
```

## Credential 설정

### 저장소별 인증 정보 저장

```bash
# 캐시 (기본 15분)
git config --global credential.helper cache

# 캐시 시간 설정 (1시간)
git config --global credential.helper 'cache --timeout=3600'

# 영구 저장 (평문 파일)
git config --global credential.helper store

# macOS Keychain
git config --global credential.helper osxkeychain

# Windows Credential Manager
git config --global credential.helper manager
```

## 조건부 설정

디렉토리에 따라 다른 설정을 적용합니다.

### ~/.gitconfig

```ini
[user]
    name = Personal Name
    email = personal@email.com

# 회사 프로젝트는 다른 이메일 사용
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work
```

### ~/.gitconfig-work

```ini
[user]
    email = work@company.com
```

## 설정 삭제

```bash
# 특정 설정 삭제
git config --global --unset user.name

# 섹션 전체 삭제
git config --global --remove-section alias
```

## 주의사항

> ⚠️ **민감 정보 주의**
> `.gitconfig`에 토큰이나 비밀번호를 저장하지 마세요.

> ⚠️ **Local 설정 우선**
> 저장소별 설정이 전역 설정을 덮어씁니다.

## 팁

```bash
# 설정 검증
git config --list --show-origin

# alias 목록 보기
git config --get-regexp alias

# 현재 저장소 설정만
git config --local --list
```

## 관련 문서

- [Git 기본 개념](./01-git-basics.md)
- [Git Hooks](./15-git-hooks.md)

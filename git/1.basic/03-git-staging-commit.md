# 스테이징과 커밋

## 개요

Git의 핵심 워크플로우는 **작업 → 스테이징 → 커밋**입니다. 이 과정을 통해 변경 사항을 버전으로 기록합니다.

## 파일의 상태

```
┌─────────────────────────────────────────────────────────────┐
│                        Untracked                            │
│                    (Git이 추적하지 않는 파일)                  │
└────────────────────────────┬────────────────────────────────┘
                             │ git add
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         Tracked                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Unmodified  │→ │   Modified   │→ │    Staged    │      │
│  │  (변경 없음)  │  │   (변경됨)    │  │  (스테이지됨)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## git status - 상태 확인

```bash
# 현재 상태 확인
git status

# 간략하게 보기
git status -s
# 또는
git status --short
```

### 출력 예시

```bash
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   staged-file.txt

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   modified-file.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        untracked-file.txt
```

### 간략 출력 (git status -s)

```bash
$ git status -s
A  staged-file.txt      # A: 스테이지에 추가됨
 M modified-file.txt    # M: 수정됨 (스테이지 안 됨)
?? untracked-file.txt   # ??: 추적되지 않음
```

## git add - 스테이징

변경 사항을 Staging Area에 추가합니다.

### 기본 사용법

```bash
# 특정 파일 추가
git add filename.txt

# 여러 파일 추가
git add file1.txt file2.txt

# 특정 디렉토리의 모든 파일
git add src/

# 모든 변경 파일 추가
git add .
# 또는
git add -A
# 또는
git add --all

# 특정 확장자만 추가
git add *.js
```

### 대화형 추가

```bash
# 변경 사항을 하나씩 확인하며 추가
git add -p
# 또는
git add --patch
```

`-p` 옵션 사용 시 선택지:

- `y`: 이 부분 추가
- `n`: 이 부분 건너뛰기
- `s`: 더 작은 단위로 분할
- `q`: 종료

## git commit - 커밋

스테이지된 변경 사항을 저장소에 기록합니다.

### 기본 사용법

```bash
# 커밋 메시지와 함께 커밋
git commit -m "커밋 메시지"

# 에디터로 커밋 메시지 작성
git commit

# add + commit 동시에 (추적 중인 파일만)
git commit -am "커밋 메시지"

# 마지막 커밋 수정
git commit --amend

# 마지막 커밋 메시지만 수정
git commit --amend -m "새로운 메시지"
```

### 커밋 메시지 컨벤션

좋은 커밋 메시지 형식:

```
<type>: <subject>

<body>

<footer>
```

#### Type 종류

| Type       | 설명                         |
| ---------- | ---------------------------- |
| `feat`     | 새로운 기능 추가             |
| `fix`      | 버그 수정                    |
| `docs`     | 문서 수정                    |
| `style`    | 코드 포맷팅 (기능 변경 없음) |
| `refactor` | 리팩토링                     |
| `test`     | 테스트 코드                  |
| `chore`    | 빌드, 패키지 매니저 설정 등  |

#### 예시

```bash
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 날짜 포맷 오류 수정"
git commit -m "docs: README 업데이트"
```

## git restore - 변경 취소

### 작업 디렉토리 변경 취소

```bash
# 특정 파일의 변경 취소
git restore filename.txt

# 모든 파일의 변경 취소
git restore .
```

### 스테이징 취소

```bash
# 특정 파일 스테이징 취소
git restore --staged filename.txt

# 모든 파일 스테이징 취소
git restore --staged .
```

## 워크플로우 예시

```bash
# 1. 파일 생성/수정
echo "Hello World" > hello.txt

# 2. 상태 확인
git status

# 3. 스테이징
git add hello.txt

# 4. 상태 다시 확인
git status

# 5. 커밋
git commit -m "feat: hello.txt 파일 추가"

# 6. 로그 확인
git log --oneline
```

## 주의사항

> ⚠️ **git add . 주의**
> 모든 파일이 추가되므로 불필요한 파일(node_modules, .env 등)이 포함될 수 있습니다.
> `.gitignore` 파일을 먼저 설정하세요.

> ⚠️ **commit --amend 주의**
> 이미 push한 커밋을 amend하면 히스토리가 변경됩니다.
> 협업 시 force push가 필요하며 주의가 필요합니다.

## 팁

```bash
# .gitignore 예시
node_modules/
.env
.DS_Store
*.log

# 빈 디렉토리 추적하기 (.gitkeep 사용)
mkdir empty-folder
touch empty-folder/.gitkeep
git add empty-folder/.gitkeep
```

## 관련 문서

- [Git 기본 개념](./01-git-basics.md)
- [로그 및 히스토리 조회](./04-git-log-history.md)
- [되돌리기 (reset, revert)](./08-git-reset-revert.md)

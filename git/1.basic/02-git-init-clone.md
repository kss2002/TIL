# 저장소 생성 및 복제

## 개요

Git 저장소(Repository)를 시작하는 두 가지 방법이 있습니다:

1. **git init**: 새로운 저장소 생성
2. **git clone**: 기존 저장소 복제

## git init - 새 저장소 생성

현재 디렉토리를 Git 저장소로 초기화합니다.

### 기본 사용법

```bash
# 현재 디렉토리를 Git 저장소로 초기화
git init

# 특정 디렉토리에 새 저장소 생성
git init my-project
```

### 실행 결과

```bash
$ git init
Initialized empty Git repository in /path/to/my-project/.git/
```

### .git 디렉토리 구조

`git init` 실행 후 생성되는 `.git` 폴더:

```
.git/
├── HEAD          # 현재 체크아웃된 브랜치를 가리킴
├── config        # 저장소 설정
├── description   # GitWeb용 설명
├── hooks/        # 클라이언트/서버 훅 스크립트
├── info/         # .gitignore 같은 전역 설정
├── objects/      # 모든 컨텐츠 저장소
└── refs/         # 브랜치, 태그 등의 포인터
```

## git clone - 저장소 복제

원격 저장소를 로컬에 복사합니다.

### 기본 사용법

```bash
# HTTPS로 복제
git clone https://github.com/username/repository.git

# SSH로 복제
git clone git@github.com:username/repository.git

# 특정 이름으로 복제
git clone https://github.com/username/repository.git my-folder
```

### 유용한 옵션

```bash
# 특정 브랜치만 복제
git clone -b develop https://github.com/username/repository.git

# 얕은 복제 (최신 커밋만)
git clone --depth 1 https://github.com/username/repository.git

# 서브모듈 포함 복제
git clone --recursive https://github.com/username/repository.git

# 특정 깊이까지만 복제
git clone --depth 10 https://github.com/username/repository.git
```

### Clone vs Init 비교

| 구분      | git init         | git clone          |
| --------- | ---------------- | ------------------ |
| 용도      | 새 저장소 생성   | 기존 저장소 복제   |
| 원격 설정 | 수동 설정 필요   | 자동 설정됨        |
| 히스토리  | 없음             | 전체 히스토리 포함 |
| 사용 시점 | 프로젝트 시작 시 | 협업 참여 시       |

## 예시: 새 프로젝트 시작하기

```bash
# 1. 프로젝트 디렉토리 생성 및 이동
mkdir my-project
cd my-project

# 2. Git 저장소 초기화
git init

# 3. 첫 파일 생성
echo "# My Project" > README.md

# 4. 스테이징 및 첫 커밋
git add README.md
git commit -m "Initial commit"

# 5. 원격 저장소 연결 (필요시)
git remote add origin https://github.com/username/my-project.git
git push -u origin main
```

## 예시: 기존 프로젝트 참여하기

```bash
# 1. 저장소 복제
git clone https://github.com/username/existing-project.git

# 2. 디렉토리 이동
cd existing-project

# 3. 브랜치 확인
git branch -a

# 4. 개발 브랜치로 전환
git checkout develop
```

## 주의사항

> ⚠️ **기존 프로젝트에 git init 주의**
> 이미 Git으로 관리되는 폴더에서 `git init`을 실행하면 기존 설정이 재초기화될 수 있습니다.

> ⚠️ **.git 폴더 삭제 주의**
> `.git` 폴더를 삭제하면 모든 버전 히스토리가 사라집니다.

## 팁

```bash
# Git 저장소인지 확인
git status
# 또는
ls -la .git

# 저장소 위치 확인
git rev-parse --show-toplevel
```

## 관련 문서

- [Git 기본 개념](./01-git-basics.md)
- [스테이징과 커밋](./03-git-staging-commit.md)
- [원격 저장소](./07-git-remote.md)

# 서브모듈

## 개요

**Git 서브모듈(Submodule)**은 Git 저장소 안에 다른 Git 저장소를 포함시키는 기능입니다.
외부 라이브러리, 공유 컴포넌트, 또는 별도로 관리되는 프로젝트를 참조할 때 사용합니다.

## 서브모듈 추가

```bash
# 기본 추가
git submodule add https://github.com/user/library.git

# 특정 경로에 추가
git submodule add https://github.com/user/library.git libs/library

# 특정 브랜치 추적
git submodule add -b main https://github.com/user/library.git
```

### 추가 후 생성되는 파일

```bash
.gitmodules     # 서브모듈 설정 파일
libs/library/   # 서브모듈 디렉토리
```

`.gitmodules` 내용:

```ini
[submodule "libs/library"]
    path = libs/library
    url = https://github.com/user/library.git
    branch = main
```

## 서브모듈이 있는 저장소 Clone

```bash
# 방법 1: clone 시 서브모듈 포함
git clone --recursive https://github.com/user/project.git

# 방법 2: clone 후 서브모듈 초기화
git clone https://github.com/user/project.git
cd project
git submodule init
git submodule update

# 방법 2 축약형
git submodule update --init

# 중첩 서브모듈까지 모두
git submodule update --init --recursive
```

## 서브모듈 업데이트

```bash
# 등록된 커밋으로 업데이트
git submodule update

# 원격의 최신 커밋으로 업데이트
git submodule update --remote

# 특정 서브모듈만
git submodule update --remote libs/library

# 모든 서브모듈 최신으로
git submodule foreach git pull origin main
```

## 서브모듈 상태 확인

```bash
# 서브모듈 목록
git submodule

# 상태 확인
git submodule status

# 출력 예시
# a1b2c3d libs/library (v1.0.0)
#  ↑ 커밋 해시
```

상태 기호:

- (없음): 정상
- `-`: 초기화 안 됨
- `+`: 다른 커밋을 체크아웃함
- `U`: 머지 충돌

## 서브모듈 내부 작업

```bash
# 서브모듈 디렉토리로 이동
cd libs/library

# 서브모듈은 독립된 Git 저장소
git checkout main
git pull origin main

# 변경 후 커밋 (서브모듈 내부)
git add .
git commit -m "fix: 버그 수정"
git push

# 메인 프로젝트로 돌아가서
cd ../..

# 서브모듈 변경 커밋
git add libs/library
git commit -m "chore: 서브모듈 업데이트"
```

## 서브모듈 브랜치 변경

```bash
# .gitmodules 수정
git config -f .gitmodules submodule.libs/library.branch develop

# 또는 직접 편집
# [submodule "libs/library"]
#     branch = develop

# 변경 적용
git submodule update --remote
```

## 서브모듈 제거

```bash
# 1. .gitmodules에서 해당 섹션 삭제
git config -f .gitmodules --remove-section submodule.libs/library

# 2. .git/config에서 해당 섹션 삭제
git config --remove-section submodule.libs/library

# 3. 캐시된 서브모듈 삭제
git rm --cached libs/library

# 4. 서브모듈 디렉토리 삭제
rm -rf libs/library

# 5. .git/modules에서 삭제
rm -rf .git/modules/libs/library

# 6. 변경사항 커밋
git commit -m "chore: 서브모듈 제거"
```

## 서브모듈 URL 변경

```bash
# .gitmodules 수정
git config -f .gitmodules submodule.libs/library.url https://new-url.git

# 동기화
git submodule sync

# 업데이트
git submodule update --init --recursive
```

## 실전 예시

### 공유 컴포넌트 관리

```
my-project/
├── src/
├── shared/           # 서브모듈
│   └── components/   # 여러 프로젝트에서 공유
└── package.json
```

```bash
# 공유 컴포넌트 서브모듈 추가
git submodule add https://github.com/team/shared-components.git shared

# 팀원이 프로젝트 clone
git clone --recursive https://github.com/team/my-project.git

# 공유 컴포넌트 업데이트
git submodule update --remote shared
git add shared
git commit -m "chore: shared components 업데이트"
```

### CI/CD에서 서브모듈

```yaml
# GitHub Actions
- uses: actions/checkout@v3
  with:
    submodules: recursive

# GitLab CI
variables:
  GIT_SUBMODULE_STRATEGY: recursive
```

## 서브모듈 vs 대안

| 방법              | 장점               | 단점              |
| ----------------- | ------------------ | ----------------- |
| **서브모듈**      | 정확한 버전 관리   | 복잡한 워크플로우 |
| **서브트리**      | 단일 저장소 유지   | 히스토리 복잡     |
| **패키지 매니저** | 간단한 의존성 관리 | 버전 고정 어려움  |
| **모노레포**      | 통합 관리          | 저장소 크기 증가  |

## 주의사항

> ⚠️ **Detached HEAD**
> 서브모듈은 기본적으로 특정 커밋을 체크아웃합니다.
> 작업 시 먼저 브랜치로 전환하세요.

```bash
cd libs/library
git checkout main
```

> ⚠️ **서브모듈 변경 커밋**
> 서브모듈 내부에서 커밋한 후,
> 메인 프로젝트에서도 서브모듈 참조를 커밋해야 합니다.

> ⚠️ **팀원 동기화**
> 서브모듈이 업데이트되면 팀원들도 `git submodule update`가 필요합니다.

## 팁

```bash
# 유용한 alias
git config --global alias.sdiff "!git diff && git submodule foreach 'git diff'"
git config --global alias.spush "push --recurse-submodules=on-demand"

# 상태 요약
git config --global status.submoduleSummary true

# 자동 업데이트 (pull 시)
git config --global submodule.recurse true
```

## 관련 문서

- [저장소 생성 및 복제](./02-git-init-clone.md)
- [원격 저장소](./07-git-remote.md)

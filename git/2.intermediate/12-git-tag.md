# 태그

## 개요

**Git 태그(Tag)**는 특정 커밋에 이름표를 붙이는 기능입니다.
주로 릴리스 버전(`v1.0.0`, `v2.1.0` 등)을 표시하는 데 사용됩니다.

## 태그 종류

### 1. Lightweight 태그

단순히 커밋을 가리키는 포인터입니다.

```bash
git tag v1.0.0
```

### 2. Annotated 태그 (권장)

태그 생성자, 날짜, 메시지 등 메타데이터를 포함합니다.

```bash
git tag -a v1.0.0 -m "첫 번째 릴리스"
```

## 태그 생성

### Lightweight 태그

```bash
# 현재 커밋에 태그
git tag v1.0.0

# 특정 커밋에 태그
git tag v1.0.0 a1b2c3d
```

### Annotated 태그 (권장)

```bash
# 메시지와 함께 생성
git tag -a v1.0.0 -m "Version 1.0.0 릴리스"

# 에디터로 메시지 작성
git tag -a v1.0.0

# 특정 커밋에 생성
git tag -a v1.0.0 a1b2c3d -m "Version 1.0.0"

# 서명된 태그 (GPG)
git tag -s v1.0.0 -m "Signed release"
```

## 태그 조회

```bash
# 모든 태그 목록
git tag

# 패턴으로 검색
git tag -l "v1.*"
git tag --list "v2.0.*"

# 태그 정보 보기
git show v1.0.0

# 태그된 커밋 수 포함
git tag -n

# 메시지 포함 (최대 N줄)
git tag -n3
```

## 태그 공유 (Push)

태그는 기본적으로 push되지 않습니다.

```bash
# 특정 태그 push
git push origin v1.0.0

# 모든 태그 push
git push origin --tags

# Annotated 태그만 push
git push origin --follow-tags
```

## 태그 삭제

```bash
# 로컬 태그 삭제
git tag -d v1.0.0

# 원격 태그 삭제
git push origin --delete v1.0.0
# 또는
git push origin :refs/tags/v1.0.0
```

## 태그 체크아웃

```bash
# 태그로 이동 (Detached HEAD)
git checkout v1.0.0

# 태그에서 새 브랜치 생성
git checkout -b hotfix/v1.0.1 v1.0.0
# 또는
git switch -c hotfix/v1.0.1 v1.0.0
```

> ⚠️ 태그를 직접 체크아웃하면 "Detached HEAD" 상태가 됩니다.
> 이 상태에서 커밋하면 브랜치에 속하지 않습니다.

## 시맨틱 버저닝 (Semantic Versioning)

가장 널리 사용되는 버전 규칙입니다.

```
v<MAJOR>.<MINOR>.<PATCH>

예: v1.4.2
```

| 구분      | 변경 시점               | 예시            |
| --------- | ----------------------- | --------------- |
| **MAJOR** | 호환되지 않는 변경      | v1.0.0 → v2.0.0 |
| **MINOR** | 하위 호환되는 기능 추가 | v1.0.0 → v1.1.0 |
| **PATCH** | 하위 호환되는 버그 수정 | v1.0.0 → v1.0.1 |

### 추가 레이블

```
v1.0.0-alpha
v1.0.0-beta.1
v1.0.0-rc.1    # Release Candidate
v1.0.0+build.123
```

## 릴리스 워크플로우 예시

```bash
# 1. 릴리스 브랜치 생성
git switch -c release/1.0.0

# 2. 버전 번호 업데이트, 테스트 등
# ... 작업 ...

# 3. main에 머지
git switch main
git merge --no-ff release/1.0.0

# 4. 태그 생성
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- 새 기능 A
- 새 기능 B

Bug fixes:
- 버그 X 수정"

# 5. 원격에 push
git push origin main
git push origin v1.0.0

# 6. develop에도 머지 (필요시)
git switch develop
git merge main
```

## GitHub Releases

GitHub에서 태그를 기반으로 Release를 만들 수 있습니다.

```bash
# 태그 push 후 GitHub에서
# Releases → Create a new release
# 태그 선택 → Release notes 작성 → Publish
```

CLI로 생성:

```bash
# GitHub CLI 사용
gh release create v1.0.0 --title "v1.0.0" --notes "Release notes here"
```

## 태그 vs 브랜치

| 구분 | 태그           | 브랜치        |
| ---- | -------------- | ------------- |
| 목적 | 특정 시점 표시 | 개발 라인     |
| 이동 | 불가 (고정)    | 커밋마다 이동 |
| 용도 | 릴리스 버전    | 기능 개발     |

## 주의사항

> ⚠️ **태그 이름 변경 불가**
> 태그 이름을 수정하려면 삭제 후 재생성해야 합니다.

```bash
# 태그 이름 변경
git tag new-tag old-tag
git tag -d old-tag
git push origin new-tag :old-tag
```

> ⚠️ **원격 태그 덮어쓰기**
> 이미 push된 태그를 수정하면 팀원들에게 혼란을 줄 수 있습니다.

## 팁

```bash
# 유용한 alias
git config --global alias.tags "tag -l -n1"

# 최신 태그 확인
git describe --tags --abbrev=0

# 태그 기준 로그
git log v1.0.0..v1.1.0 --oneline

# 특정 태그 이후 커밋 수
git rev-list v1.0.0..HEAD --count
```

## 관련 문서

- [원격 저장소](./07-git-remote.md)
- [Git Flow 전략](./18-git-flow.md)
- [브랜치 기초](./05-git-branch-basics.md)

# 브랜치 기초

## 개요

**브랜치(Branch)**는 독립적인 작업 공간입니다. Git의 가장 강력한 기능 중 하나로, 메인 코드에 영향을 주지 않고 새로운 기능을 개발하거나 실험할 수 있습니다.

## 브랜치 개념

```
          ┌─ feature ─┐
         /             \
main ───●───●───●───●───●───●
```

- 브랜치는 커밋을 가리키는 **포인터**입니다
- 새 브랜치 생성은 새 포인터 생성일 뿐 (매우 가벼움)
- **HEAD**는 현재 작업 중인 브랜치를 가리킵니다

## 브랜치 조회

```bash
# 로컬 브랜치 목록
git branch

# 원격 브랜치 포함
git branch -a

# 원격 브랜치만
git branch -r

# 마지막 커밋 정보 포함
git branch -v

# 머지된 브랜치만
git branch --merged

# 머지 안 된 브랜치만
git branch --no-merged

# 현재 브랜치 확인
git branch --show-current
```

### 출력 예시

```bash
$ git branch -v
  develop a1b2c3d 개발용 브랜치
* main    e4f5g6h 프로덕션 브랜치
  feature i7j8k9l 새 기능 개발
```

`*`는 현재 체크아웃된 브랜치를 표시합니다.

## 브랜치 생성

```bash
# 브랜치 생성 (이동하지 않음)
git branch feature-login

# 특정 커밋에서 브랜치 생성
git branch feature-login a1b2c3d

# 브랜치 생성과 동시에 이동
git checkout -b feature-login
# 또는 (Git 2.23+)
git switch -c feature-login
```

## 브랜치 이동 (체크아웃)

### git checkout (기존 방식)

```bash
# 브랜치로 이동
git checkout develop

# 브랜치 생성 및 이동
git checkout -b new-feature
```

### git switch (Git 2.23+, 권장)

```bash
# 브랜치로 이동
git switch develop

# 브랜치 생성 및 이동
git switch -c new-feature

# 이전 브랜치로 이동
git switch -
```

> 💡 `git switch`는 `git checkout`의 브랜치 관련 기능만 분리한 명령어입니다.
> `git checkout`은 파일 복원 기능도 있어서 혼란스러울 수 있습니다.

## 브랜치 이름 변경

```bash
# 현재 브랜치 이름 변경
git branch -m new-name

# 특정 브랜치 이름 변경
git branch -m old-name new-name
```

## 브랜치 삭제

```bash
# 브랜치 삭제 (머지된 경우만)
git branch -d feature-login

# 강제 삭제 (머지 안 됐어도)
git branch -D feature-login

# 원격 브랜치 삭제
git push origin --delete feature-login
# 또는
git push origin :feature-login
```

## 브랜치 네이밍 컨벤션

```
<type>/<description>
```

### 일반적인 접두사

| 접두사     | 용도         | 예시                    |
| ---------- | ------------ | ----------------------- |
| `feature/` | 새 기능 개발 | `feature/user-login`    |
| `bugfix/`  | 버그 수정    | `bugfix/login-error`    |
| `hotfix/`  | 긴급 수정    | `hotfix/security-patch` |
| `release/` | 릴리스 준비  | `release/v1.2.0`        |
| `chore/`   | 기타 작업    | `chore/update-deps`     |

## 실전 예시

### 새 기능 개발 플로우

```bash
# 1. main에서 시작
git switch main

# 2. 최신 코드 가져오기
git pull origin main

# 3. 기능 브랜치 생성 및 이동
git switch -c feature/user-profile

# 4. 작업...
# ... 코드 수정 ...

# 5. 커밋
git add .
git commit -m "feat: 사용자 프로필 페이지 추가"

# 6. 원격에 푸시
git push -u origin feature/user-profile

# 7. PR 생성 후 머지

# 8. 작업 완료 후 main으로 이동
git switch main

# 9. 로컬 브랜치 삭제
git branch -d feature/user-profile
```

## 주의사항

> ⚠️ **커밋 안 된 변경사항 있을 때 브랜치 이동**
> 작업 중인 변경사항이 있으면 이동 시 충돌할 수 있습니다.
> `git stash`로 임시 저장하거나 먼저 커밋하세요.

```bash
# 변경사항 임시 저장
git stash

# 브랜치 이동
git switch other-branch

# 다시 돌아와서 복원
git switch original-branch
git stash pop
```

> ⚠️ **삭제된 브랜치는 복구가 어려움**
> 삭제 전 정말 삭제해도 되는지 확인하세요.
> 필요하다면 `git reflog`로 복구 시도할 수 있습니다.

## 팁

```bash
# 유용한 alias 설정
git config --global alias.br "branch"
git config --global alias.co "checkout"
git config --global alias.sw "switch"

# 사용
git br    # git branch
git co    # git checkout
git sw    # git switch
```

## 관련 문서

- [머지(병합)](./06-git-merge.md)
- [Rebase](./10-git-rebase.md)
- [Git Flow 전략](./18-git-flow.md)
- [임시 저장 (stash)](./09-git-stash.md)

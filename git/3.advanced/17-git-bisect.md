# Bisect (버그 찾기)

## 개요

**git bisect**는 이진 탐색을 사용하여 버그가 도입된 커밋을 찾는 도구입니다.
수백 개의 커밋 중에서도 빠르게 문제의 원인을 찾을 수 있습니다.

## 작동 원리

```
좋음 → ? → ? → ? → ? → ? → 나쁨
 ↓
이진 탐색으로 중간 커밋 테스트
 ↓
좋음 → 좋음 → 좋음 → 나쁨 → 나쁨 → 나쁨
                     ↑
                 버그 도입 커밋!
```

N개의 커밋에서 최대 log₂(N)번의 테스트로 찾을 수 있습니다.

- 1000개 커밋 → 최대 10번 테스트

## 기본 사용법

### 수동 bisect

```bash
# 1. bisect 시작
git bisect start

# 2. 현재(나쁜) 커밋 표시
git bisect bad

# 3. 정상 작동하던 커밋 표시
git bisect good v1.0.0
# 또는 커밋 해시
git bisect good a1b2c3d

# 4. Git이 중간 커밋을 체크아웃
# Bisecting: 500 revisions left to test

# 5. 테스트 후 결과 표시
git bisect good   # 이 커밋은 정상
# 또는
git bisect bad    # 이 커밋은 문제 있음

# 6. 반복... Git이 범위를 좁혀감

# 7. 결과 확인 (원인 커밋 발견)
# e4f5g6h is the first bad commit
# commit e4f5g6h
# Author: ...
# Date: ...
#
#     이 커밋에서 버그 도입

# 8. bisect 종료
git bisect reset
```

### bisect 상태 확인

```bash
# 현재 bisect 진행상황
git bisect log

# 시각화
git bisect visualize
# 또는
git bisect view
```

## 자동 bisect

테스트 스크립트로 자동화할 수 있습니다.

```bash
# 테스트 스크립트 사용
git bisect start HEAD v1.0.0
git bisect run ./test.sh
```

### 테스트 스크립트 규칙

- 종료 코드 0: good (정상)
- 종료 코드 1-124, 126-127: bad (문제)
- 종료 코드 125: skip (테스트 불가)

### test.sh 예시

```bash
#!/bin/bash

# 빌드
npm run build
if [ $? -ne 0 ]; then
    exit 125  # skip (빌드 실패는 테스트 불가)
fi

# 특정 테스트 실행
npm test -- --grep "특정 기능"
if [ $? -ne 0 ]; then
    exit 1    # bad
fi

exit 0        # good
```

### 명령어로 직접 실행

```bash
# make test 결과로 판단
git bisect run make test

# npm test 사용
git bisect run npm test

# 특정 조건 확인
git bisect run sh -c 'grep -q "버그패턴" file.js && exit 1 || exit 0'
```

## 특정 커밋 건너뛰기

테스트할 수 없는 커밋은 건너뛸 수 있습니다.

```bash
# 현재 커밋 건너뛰기
git bisect skip

# 특정 커밋 건너뛰기
git bisect skip a1b2c3d

# 범위 건너뛰기
git bisect skip a1b2c3d..e4f5g6h
```

## 실전 예시

### 성능 저하 원인 찾기

```bash
# bisect 시작
git bisect start

# 현재 (느림)
git bisect bad

# 1달 전 (빨랐음)
git bisect good HEAD~100

# 중간 커밋으로 이동됨
# 성능 테스트...

# 빠르면
git bisect good

# 느리면
git bisect bad

# 반복하다가 원인 커밋 발견!
```

### 자동화된 성능 bisect

```bash
#!/bin/bash
# perf-test.sh

# 빌드
npm run build || exit 125

# 성능 테스트 (3초 이상이면 bad)
START=$(date +%s%N)
node index.js
END=$(date +%s%N)
DIFF=$((($END - $START) / 1000000))

if [ $DIFF -gt 3000 ]; then
    exit 1  # bad (3초 이상)
fi
exit 0      # good
```

```bash
git bisect start HEAD v1.0.0
git bisect run ./perf-test.sh
```

### 특정 파일 변경 추적

```bash
# 특정 파일이 변경된 커밋만 대상으로
git bisect start HEAD v1.0.0 -- src/problematic-file.js
```

## bisect 로그 저장/재현

```bash
# 로그 저장
git bisect log > bisect.log

# 나중에 재현
git bisect replay bisect.log
```

## 주의사항

> ⚠️ **bisect 중 다른 작업 주의**
> bisect는 커밋을 체크아웃하며 작동합니다.
> 진행 중에 다른 브랜치 작업을 하면 안 됩니다.

> ⚠️ **빌드 실패 처리**
> 중간 커밋이 빌드되지 않으면 `git bisect skip`을 사용하세요.

> ⚠️ **reset 잊지 않기**
> 완료 후 반드시 `git bisect reset`을 실행하세요.

## 팁

```bash
# bisect 중 현재 위치 확인
git bisect log | tail -1

# 특정 경로만 대상으로
git bisect start HEAD v1.0.0 -- path/to/directory/

# 용어 변경 (good/bad 대신)
git bisect start --term-old=working --term-new=broken
git bisect working v1.0.0
git bisect broken HEAD

# 중간에 포기
git bisect reset
```

## 관련 문서

- [로그 및 히스토리 조회](./04-git-log-history.md)
- [Reflog](./13-git-reflog.md)

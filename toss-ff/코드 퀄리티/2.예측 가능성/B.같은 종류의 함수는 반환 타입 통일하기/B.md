## 개선해보기

다음 코드처럼 서버 API를 호출하는 Hook은 일관적으로 Query 객체를 반환하게 하면, 팀원들이 코드에 대한 예측 가능성을 높일 수 있어요.

```tsx
import { useQuery } from '@tanstack/react-query';

function useUser() {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return query;
}

function useServerTime() {
  const query = useQuery({
    queryKey: ['serverTime'],
    queryFn: fetchServerTime,
  });

  return query;
}
```

## 개선해보기

다음 코드처럼 유효성 검사 함수가 일관적으로 { ok, ... } 타입의 객체를 반환하게 할 수 있어요.

```tsx
/** 사용자 이름은 20자 미만이어야 해요. */
function checkIsNameValid(name: string) {
  if (name.length === 0) {
    return {
      ok: false,
      reason: '이름은 빈 값일 수 없어요.',
    };
  }

  if (name.length >= 20) {
    return {
      ok: false,
      reason: '이름은 20자 이상 입력할 수 없어요.',
    };
  }

  return { ok: true };
}

/** 사용자 나이는 18세 이상 99세 이하의 자연수여야 해요. */
function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return {
      ok: false,
      reason: '나이는 정수여야 해요.',
    };
  }

  if (age < 18) {
    return {
      ok: false,
      reason: '나이는 18세 이상이어야 해요.',
    };
  }

  if (age > 99) {
    return {
      ok: false,
      reason: '나이는 99세 이하이어야 해요.',
    };
  }

  return { ok: true };
}
```

## TIP

유효성 검사 함수의 반환 타입을 Discriminated Union으로 정의하면, ok 값에 따라 reason의 존재 유무를 확인할 수 있어요.

```tsx
type ValidationCheckReturnType = { ok: true } | { ok: false; reason: string };

function checkIsAgeValid(age: number): ValidationCheckReturnType {
  if (!Number.isInteger(age)) {
    return {
      ok: false,
      reason: '나이는 정수여야 해요.',
    };
  }
  // ...
}

const isAgeValid = checkIsAgeValid(1.1);

if (isAgeValid.ok) {
  isAgeValid.reason; // 타입 에러: { ok: true } 타입에는 reason 속성이 없어요
} else {
  isAgeValid.reason; // ok가 false일 때만 reason 속성에 접근할 수 있어요
}
```

API 호출과 관련된 Hook들처럼 같은 종류의 함수나 Hook이 서로 다른 반환 타입을 가지면 코드의 일관성이 떨어져서, 같이 일하는 동료들이 코드를 읽는 데에 헷갈릴 수 있어요.

## 코드 예시 1: useUser

다음 useUser 와 useServerTime Hook은 모두 API 호출과 관련된 Hook이에요.

그렇지만 useUser는 @tanstack/react-query의 Query 객체를 반환하고, useServerTime은 서버 시간을 가져와서 데이터만 반환해요.

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

  return query.data;
}
```

## 코드 냄새 맡아보기

서버 API를 호출하는 Hook의 반환 타입이 서로 다르다면, 동료들은 이런 Hook을 쓸 때마다 반환 타입이 무엇인지 확인해야 해요. Query 객체를 반환한다면 data를 꺼내야 하고, 데이터만 반환한다면 그대로 값을 사용할 수 있죠.

같은 종류의 동작을 하는 코드가 일관적인 규칙에 따르고 있지 않으면 코드를 읽고 쓰는 데 헷갈려요.

## 코드 예시 2: checkIsValid

다음 checkIsNameValid 와 checkIsAgeValid는 모두 이름과 나이가 올바른지 검증하는 함수예요.

```tsx
// 사용자 이름은 20자 미만이어야 해요.
function checkIsNameValid(name: string) {
  const isValid = name.length > 0 && name.length < 20;

  return isValid;
}

// 사용자 나이는 18세 이상 99세 이하의 자연수여야 해요.
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

## 코드 냄새 맡아보기

예측 가능성
유효성 검사 함수의 반환 값이 다르다면, 동료들은 함수를 쓸 때마다 반환 타입을 확인해야 해서 혼란이 생겨요.

특히 [엄격한 불리언 검증](https://typescript-eslint.io/rules/strict-boolean-expressions/)과 같은 기능을 사용하지 않는 경우, 코드의 오류가 생기는 원인이 될 수 있어요.

```tsx
// 이 코드는 이름이 규칙에 맞는지 올바르게 검증해요
if (checkIsNameValid(name)) {
  // ...
}

// 이 함수는 항상 객체 { ok, ... } 를 반환하기 때문에,
// `if` 문 안에 있는 코드가 항상 실행돼요
if (checkIsAgeValid(age)) {
  // ...
}
```

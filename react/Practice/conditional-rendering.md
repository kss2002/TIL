# 조건부 렌더링

### ✅리액트에서 조건부 렌더링하는 방법

React에서 조건문을 작성하는 데에는 특별한 문법이 필요 없다.

일반적인 자바스크립트 코드를 작성할 때 사용하는 것과 동일한 방법을 사용한다.

예를 들어 if 문을 사용하여 조건부로 JSX를 포함할 수 있다.

```jsx
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return <div>{content}</div>;
```

더욱 간결한 코드를 원한다면 조건부 삼항 연산자를 사용할 수 있다.

이것은 if 문과 달리 JSX 내부에서 동작한다.

```jsx
<div>{isLoggedIn ? <AdminPanel /> : <LoginForm />}</div>
```

특히 위 삼항 연산자는 많이 쓰이니 알아두면 좋을 것!

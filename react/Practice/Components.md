# Components

### ✅컴포넌트 생성 및 중첩하기

React 앱은 컴포넌트로 구성된다. 정확히는 컴포넌트의 집합이다.

컴포넌트는 고유한 로직과 모양을 가진 UI(사용자 인터페이스)의 일부이다.

컴포넌트는 버튼만큼 작을 수도 있고 전체 페이지만큼 클 수도 있다.

React 컴포넌트는 마크업을 반환하는 자바스크립트 함수다.

```
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

이제 MyButton을 선언했으므로 다른 컴포넌트 안에 중첩할 수 있다. (중요)

```
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

이때 `<MyButton />`이 대문자로 시작하는 것이 중요하다.

이것이 바로 React 컴포넌트임을 알 수 있는 방법이다.

React 컴포넌트의 이름은 항상 대문자로 시작해야 한다.

컴포넌트는 일종의 레고 조립처럼 재사용하기 편하다.

이는 개발자가 개발하기 쉽게 만든다.

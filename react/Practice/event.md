# 이벤트에 응답하기

### ✅ 이벤트 핸들러

컴포넌트 내부에서 이벤트 핸들러 함수를 선언하여 이벤트에 응답할 수 있다.

예시 코드 >

```jsx
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

onClick={handleClick}의 끝에 소괄호(())가 없는 것을 주목하자!

이벤트 핸들러 함수를 호출하지 않고 전달만 하면 된다.

React는 사용자가 버튼을 클릭할 때 이벤트 핸들러를 호출한다.

https://ko.react.dev/learn#responding-to-events

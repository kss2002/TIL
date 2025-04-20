# JSX

### ✅JSX로 마크업 작성하기

리액트 앱의 문법은 jsx라고 부르는 문법으로 작성된다.

이를 통해 우리는 HTML을 작성하는 것이다.

여기에 자바스크립트 기능이 합쳐진 것이 jsx이다.

jsx는 HTML보다 엄격하다. jsx에서는 태그를 무조건 닫아야 한다.

코드는 다음처럼 전체 return 안에 태그를 감싸야 한다.

```
function AboutPage() {
  return (
    {/* 주석 */}
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

jsx에서는 <>...</> 같은 빈 태그도 제공해준다.

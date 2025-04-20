# style

### ✅스타일 추가하기

리액트에선 className 으로 CSS 클래스를 지정한다.

이것은 HTML에서 class를 지정하는 것과 동일하게 작동한다.

```
<img className="avatar" />
```

그 다음, 별도의 css 파일에 해당 css 규칙을 적용하면 된다.

```
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

리액트에서는 정말 많은 방식으로 스타일을 줄 수 있다.

(여기엔 scss도 있고, 테일윈드 css도 있고.. emotion도 있고.. 엄청 많다!)

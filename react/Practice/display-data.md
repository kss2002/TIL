# 데이터 표시하기

### ✅중괄호를 사용해서 코드에서 일부 변수를 삽입하기

<b>JSX를 사용하면 자바스크립트에 마크업을 넣을 수 있다.</b>

중괄호를 사용하면 코드에서 일부 변수를 삽입하여 사용자에게 표시할 수 있도록 자바스크립트로 “이스케이프 백(Escape Back)” 할 수 있다.

아래의 예시는 user.name을 표시한다.

```
return (
  <h1>
    {user.name}
  </h1>
);
```

쉽게 말해서 어딘가 "객체"을 할당하고 그 안에 여러 변수를 만든다.

그 여러 변수 중 "특정 데이터"를 가져올 수 있는 것이다.

- 예시 코드 >

```
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

user라는 객체를 만든다. 그 안에는 name, imageUrl, imageSize 라는 데이터가 있는 것.

h1에는 user의 name를 가져온다.

이런 방식은 하드코딩을 방지하고, 데이터를 유동적으로 바꿀 수 있게 한다.

특히 코드를 부품화할 때 자주 쓰이니 꼭 기억해두자.

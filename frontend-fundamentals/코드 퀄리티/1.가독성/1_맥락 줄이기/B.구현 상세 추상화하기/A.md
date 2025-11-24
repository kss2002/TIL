## 코드 예시 1: LoginStartPage

다음 <LoginStartPage /> 컴포넌트는 사용자가 로그인되었는지 확인하고, 로그인이 된 경우 홈으로 이동시키는 로직을 가지고 있어요.

```tsx
function LoginStartPage() {
  useCheckLogin({
    onChecked: (status) => {
      if (status === 'LOGGED_IN') {
        location.href = '/home';
      }
    },
  });

  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

---

## 코드 예시 2: FriendInvitation

다음 <FriendInvitation /> 컴포넌트는 클릭하면 사용자에게 동의를 받고 사용자에게 초대를 보내는 페이지 컴포넌트예요.

```tsx
function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`${data.name}님에게 공유해요`}
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => close(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
            확인
          </ConfirmDialog.ConfirmButton>
        }
        /* 중략 */
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <Button onClick={handleClick}>초대하기</Button>
      {/* UI를 위한 JSX 마크업... */}
    </>
  );
}
```

## 더 알아보기: 추상화

토스 기술 블로그의 선언적인 코드 작성하기 문서에서는 코드를 글로 비유해요.

https://toss.tech/article/frontend-declarative-code

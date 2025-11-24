## 개선해보기

사용자가 로그인되었는지 확인하고 이동하는 로직을 HOC(Higher-Order Component) 나 Wrapper 컴포넌트로 분리하여, 코드를 읽는 사람이 한 번에 알아야 하는 맥락을 줄여요. 그래서 코드의 가독성을 높일 수 있어요.

또한, 분리된 컴포넌트 안에 있는 로직끼리 참조를 막음으로써, 코드 간의 불필요한 의존 관계가 생겨서 복잡해지는 것을 막을 수 있어요.

```tsx
// 옵션 A: Wrapper 컴포넌트 사용하기
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === 'LOGGED_IN') {
      location.href = '/home';
    }
  }, [status]);

  return status !== 'LOGGED_IN' ? children : null;
}

function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

```tsx
// 옵션 B: HOC(Higher-Order Component) 사용하기
function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}

export default withAuthGuard(LoginStartPage);

// HOC 정의
function withAuthGuard(WrappedComponent) {
  return function AuthGuard(props) {
    const status = useCheckLoginStatus();

    useEffect(() => {
      if (status === 'LOGGED_IN') {
        location.href = '/home';
      }
    }, [status]);

    return status !== 'LOGGED_IN' ? <WrappedComponent {...props} /> : null;
  };
}
```

---

## 개선해보기

사용자에게 동의를 받는 로직과 버튼을 <InviteButton /> 컴포넌트로 추상화했어요.

```tsx
export function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <InviteButton name={data.name} />
      {/* UI를 위한 JSX 마크업 */}
    </>
  );
}

function InviteButton({ name }) {
  return (
    <Button
      onClick={async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
          <ConfirmDialog
            title={`${name}님에게 공유해요`}
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
      }}
    >
      초대하기
    </Button>
  );
}
```

<InviteButton /> 컴포넌트는 사용자를 초대하는 로직과 UI만 가지고 있으므로, 한 번에 인지해야 하는 내용을 적게 유지해서 가독성을 높일 수 있어요. 또한, 버튼과 클릭 후 실행되는 로직이 아주 가까이에 있어요.

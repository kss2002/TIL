코드를 읽을 때 코드의 위아래를 왔다갔다 하면서 읽거나, 여러 파일이나 함수, 변수를 넘나들면서 읽는 것을 `시점 이동`이라고 해요. 시점이 여러 번 이동할수록 코드를 파악하는 데에 시간이 더 걸리고, 맥락을 파악하는 데에 어려움이 있을 수 있어요.

코드를 위에서 아래로, 하나의 함수나 파일에서 읽을 수 있도록 코드를 작성하면, 읽는 사람이 동작을 빠르게 파악할 수 있게 돼요.

## 코드 예시

다음 코드에서는 사용자의 권한에 따라서 버튼을 다르게 보여줘요.

- 사용자의 권한이 관리자(Admin)라면, Invite와 View 버튼을 보여줘요.
- 사용자의 권한이 보기 전용(Viewer)이라면, Invite 버튼은 비활성화하고, View 버튼을 보여줘요.

```tsx
function Page() {
  const user = useUser();
  const policy = getPolicyByRole(user.role);

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}

function getPolicyByRole(role) {
  const policy = POLICY_SET[role];

  return {
    canInvite: policy.includes('invite'),
    canView: policy.includes('view'),
  };
}

const POLICY_SET = {
  admin: ['invite', 'view'],
  viewer: ['view'],
};
```

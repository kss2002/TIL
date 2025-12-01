## 개선해보기

다음 코드는 사용자가 보기 전용 권한을 가질 때와 일반 사용자일 때를 완전히 나누어서 관리하도록 하는 코드예요.

<SubmitButton /> 코드 곳곳에 있던 분기가 단 하나로 합쳐지면서, 분기가 줄어들었어요.
<ViewerSubmitButton />과 <AdminSubmitButton /> 에서는 하나의 분기만 관리하기 때문에, 코드를 읽는 사람이 한 번에 고려해야 할 맥락이 적어요.

```tsx
function SubmitButton() {
  const isViewer = useRole() === 'viewer';

  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showButtonAnimation();
  }, []);

  return <Button type="submit">Submit</Button>;
}
```

```javascript
function SubmitButton() {
  const isViewer = useRole() === 'viewer';

  useEffect(() => {
    if (isViewer) {
      return;
    }
    showButtonAnimation();
  }, [isViewer]);

  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

📝 코드 예시
다음 <SubmitButton /> 컴포넌트는 사용자의 권한에 따라서 다르게 동작해요.

사용자의 권한이 보기 전용("viewer")이면, 초대 버튼은 비활성화되어 있고, 애니메이션도 재생하지 않아요.
사용자가 일반 사용자이면, 초대 버튼을 사용할 수 있고, 애니메이션도 재생해요.

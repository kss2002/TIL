## 개선해보기

숫자 300의 맥락을 정확하게 표시하기 위해서 상수 ANIMATION_DELAY_MS로 선언할 수 있어요.

```tsx
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

## 개선해보기

다음과 같이 조건을 if 문으로 풀어서 사용하면 보다 명확하고 간단하게 조건을 드러낼 수 있어요.

```tsx
const status = (() => {
  if (A조건 && B조건) return 'BOTH';
  if (A조건) return 'A';
  if (B조건) return 'B';
  return 'NONE';
})();
```

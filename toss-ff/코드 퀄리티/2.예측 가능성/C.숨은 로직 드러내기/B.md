## 개선해보기

함수의 이름과 파라미터, 반환 타입으로 예측할 수 있는 로직만 구현 부분에 남기세요.

```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>('...');

  return balance;
}
```

로깅을 하는 코드는 별도로 분리하세요.

```tsx
<Button
  onClick={async () => {
    const balance = await fetchBalance();
    logging.log('balance_fetched');

    await syncBalance(balance);
  }}
>
  계좌 잔액 갱신하기
</Button>
```

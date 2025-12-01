## 개선해보기

다음 코드와 같이 조건에 명시적인 이름을 붙이면, 코드를 읽는 사람이 한 번에 고려해야 할 맥락을 줄일 수 있어요.

```tsx
const matchedProducts = products.filter((product) => {
  return product.categories.some((category) => {
    const isSameCategory = category.id === targetCategory.id;
    const isPriceInRange = product.prices.some(
      (price) => price >= minPrice && price <= maxPrice
    );

    return isSameCategory && isPriceInRange;
  });
});
```

명시적으로 같은 카테고리 안에 속해 있고, 가격 범위가 맞는 제품들로 필터링한다고 작성함으로써, 복잡한 조건식을 따라가지 않고도 코드의 의도를 명확히 드러낼 수 있어요.

"프로그래머의 뇌"에 따르면, 사람의 뇌가 한 번에 저장할 수 있는 정보의 숫자는 6개라고 해요.

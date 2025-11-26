## 코드 예시

다음 코드는 상품 중에서 카테고리와 가격 범위가 일치하는 상품만 필터링하는 로직이에요.

```tsx
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);
```

### 가독성

이 코드에서는 익명 함수와 조건이 복잡하게 얽혀 있어요. filter와 some, && 같은 로직이 여러 단계로 중첩되어 있어서 정확한 조건을 파악하기 어려워졌어요.

코드를 읽는 사람이 한 번에 고려해야 하는 맥락이 많아서, 가독성이 떨어져요.

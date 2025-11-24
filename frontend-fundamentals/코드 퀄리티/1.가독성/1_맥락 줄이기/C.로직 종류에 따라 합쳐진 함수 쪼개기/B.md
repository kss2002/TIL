## 개선해보기

다음 코드와 같이 각각의 쿼리 파라미터별로 별도의 Hook을 작성할 수 있어요.

```tsx
import { NumberParam, useQueryParam } from 'use-query-params';

export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam('cardId', NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, 'replaceIn');
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

Hook이 담당하는 책임을 분리했기 때문에, 기존 usePageState() Hook보다 명확한 이름을 가져요. 또한 Hook을 수정했을 때 영향이 갈 범위를 좁혀서, 예상하지 못한 변경이 생기는 것을 막을 수 있어요.

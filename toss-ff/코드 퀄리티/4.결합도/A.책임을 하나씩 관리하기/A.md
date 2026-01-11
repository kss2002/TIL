쿼리 파라미터, 상태, API 호출과 같은 로직의 종류에 따라서 함수나 컴포넌트, Hook을 나누지 마세요. 한 번에 다루는 맥락의 종류가 많아져서 이해하기 힘들고 수정하기 어려운 코드가 돼요.

## 코드 예시

다음 `usePageState()` Hook은 페이지 전체의 URL 쿼리 파라미터를 한 번에 관리해요.

```tsx
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import {
  ArrayParam,
  DateParam,
  NumberParam,
  useQueryParams,
} from 'use-query-params';

const defaultDateFrom = moment().subtract(3, 'month');
const defaultDateTo = moment();

export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam,
  });

  return useMemo(
    () => ({
      values: {
        cardId: query.cardId ?? undefined,
        statementId: query.statementId ?? undefined,
        dateFrom:
          query.dateFrom == null ? defaultDateFrom : moment(query.dateFrom),
        dateTo: query.dateTo == null ? defaultDateTo : moment(query.dateTo),
        statusList: query.statusList as StatementStatusType[] | undefined,
      },
      controls: {
        setCardId: (cardId: number) => setQuery({ cardId }, 'replaceIn'),
        setStatementId: (statementId: number) =>
          setQuery({ statementId }, 'replaceIn'),
        setDateFrom: (date?: Moment) =>
          setQuery({ dateFrom: date?.toDate() }, 'replaceIn'),
        setDateTo: (date?: Moment) =>
          setQuery({ dateTo: date?.toDate() }, 'replaceIn'),
        setStatusList: (statusList?: StatementStatusType[]) =>
          setQuery({ statusList }, 'replaceIn'),
      },
    }),
    [query, setQuery]
  );
}
```

## 코드 냄새 맡아보기

이 Hook은 "이 페이지에 필요한 모든 쿼리 매개변수를 관리하는 것"이라는 광범위한 책임을 가지고 있어요. 이로 인해 페이지 내의 컴포넌트나 다른 훅들이 이 훅에 의존하게 될 수 있으며, 코드 수정을 할 때 영향 범위가 급격히 확장될 수 있어요.

시간이 지나며 이 Hook은 유지 관리가 점점 어려워지고, 수정하기 힘든 코드로 발전할 수 있어요.

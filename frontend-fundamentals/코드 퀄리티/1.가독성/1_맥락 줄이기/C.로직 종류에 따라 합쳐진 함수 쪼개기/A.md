## 코드 예시

다음 usePageState() Hook은 페이지 전체의 URL 쿼리 파라미터를 한 번에 관리해요.

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

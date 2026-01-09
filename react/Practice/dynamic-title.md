# 동적으로 사이트 타이틀 변경하기

1. 커스텀 훅 만들기

```ts
// hooks/usePageTitle.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const titleMap: Record<string, string> = {
  '/': '홈 - 내 사이트',
  '/desc': '설명 - 내 사이트',
};

export function usePageTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = titleMap[location.pathname] || '내 사이트';
  }, [location.pathname]);
}
```

2. 전역에 훅 추가하기

모든 ui 요소 위에 훅이 동작하게 설계한다.

```tsx
// layout/Index.tsx
import { Outlet } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';

export const Index = () => {
  usePageTitle();

  return (
    <div>
      {/* 네비게이션 등 레이아웃 요소들 */}
      <Outlet />
    </div>
  );
};
```

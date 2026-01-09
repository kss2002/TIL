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

### index.html

기존 title 태그에 있는 이름은 초기 로딩의 타이틀 시점에 보이게 된다.
그래서 기본적인 사이트의 이름을 설정해주자.

```html
<!DOCTYPE html>
 ...
    <title>뽀모도로 타이머</title>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

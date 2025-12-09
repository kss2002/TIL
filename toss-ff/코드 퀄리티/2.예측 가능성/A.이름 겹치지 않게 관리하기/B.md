## 개선해보기

서비스에서 만든 함수에는 라이브러리의 함수명과 구분되는 명확한 이름을 사용해서 함수의 동작을 예측 가능하게 만들 수 있어요.

```tsx
// httpService.ts
// 이 서비스는 `http`라는 라이브러리를 쓰고 있어요
import { http as httpLibrary } from '@some-library/http';

// 라이브러리 함수명과 구분되도록 명칭을 변경했어요.
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();

    // 토큰을 헤더에 추가하는 등 인증 로직을 추가해요.
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

```tsx
// fetchUser.ts
// httpService.ts에서 정의한 httpService를 가져오는 코드
import { httpService } from './httpService';

export async function fetchUser() {
  // 함수명을 통해 이 함수가 인증된 요청을 보내는 것을 알 수 있어요.
  return await httpService.getWithAuth('...');
}
```

이렇게 해서 함수의 이름을 봤을 때 동작을 오해할 수 있는 가능성을 줄일 수 있어요. 다른 개발자가 이 함수를 사용할 때, 서비스에서 정의한 함수라는 것을 인지하고 올바르게 사용할 수 있어요.

또한, `getWithAuth`라는 이름으로 이 함수가 인증된 요청을 보낸다는 것을 명확하게 전달할 수 있어요.

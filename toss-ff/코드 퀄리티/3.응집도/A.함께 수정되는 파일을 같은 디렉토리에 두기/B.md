## 개선해보기

다음은 함께 수정되는 코드 파일끼리 하나의 디렉토리를 이루도록 구조를 개선한 예시예요.

```txt
└─ src
   │  // 전체 프로젝트에서 사용되는 코드
   ├─ components
   ├─ containers
   ├─ hooks
   ├─ utils
   ├─ ...
   │
   └─ domains
      │  // Domain1에서만 사용되는 코드
      ├─ Domain1
      │     ├─ components
      │     ├─ containers
      │     ├─ hooks
      │     ├─ utils
      │     └─ ...
      │
      │  // Domain2에서만 사용되는 코드
      └─ Domain2
            ├─ components
            ├─ containers
            ├─ hooks
            ├─ utils
            └─ ...
```

함께 수정되는 코드 파일을 하나의 디렉토리 아래에 둔다면, 코드 사이의 의존 관계를 파악하기 쉬워요.

예를 들어, 다음과 같이 한 도메인(Domain1)의 하위 코드에서 다른 도메인(Domain2)의 소스 코드를 참조한다고 생각해 볼게요.

```tsx
import { useFoo } from '../../../Domain2/hooks/useFoo';
```

이런 import 문을 만난다면 잘못된 파일을 참조하고 있다는 것을 쉽게 인지할 수 있게 돼요.

또한, 특정 기능과 관련된 코드를 삭제할 때 한 디렉토리 전체를 삭제하면 깔끔하게 모든 코드가 삭제되므로, 프로젝트 내부에 더 이상 사용되지 않는 코드가 없도록 할 수 있어요.

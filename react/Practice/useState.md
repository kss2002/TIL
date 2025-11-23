## useState

리액트에선 useState라는 hook을 이용해서 상태를 변경할 수 있다.

코드를 살펴보면..

```jsx
import React, { useState } from 'react';

function Counter() {
  const [number, setNumber] = useState(0);

  const onIncrease = () => {
    setNumber(number + 1);
  };

  const onDecrease = () => {
    setNumber(number - 1);
  };

  return (
    <div>
      <h1>{number}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
}

export default Counter;
```

위 코드를 통해 숫자를 변경할 수 있는 컴포넌트를 만들 수 있다.

일단 사용을 위해서는 상단에 ..

```jsx
import React, { useState } from 'react';
```

를 이용해서 리액트에서 useState를 가져온다. (이거 안하면 에러 뜸.)

이후 우리가 사용할 함수를 정의하고, 그 안에서 작동할 값을 설정하면 된다.

초기값은 useState에 할당해준다.

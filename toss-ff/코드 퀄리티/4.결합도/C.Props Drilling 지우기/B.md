## 개선해보기

## A. 조합(Composition) 패턴 활용

조합 패턴을 사용하면 부모 컴포넌트가 자식 컴포넌트에 Props를 일일이 전달해야 하는 Props Drilling 문제를 해결할 수 있어요.

더 나아가, 조합 패턴은 불필요한 중간 추상화를 제거하여 개발자가 각 컴포넌트의 역할과 의도를 보다 명확하게 이해할 수 있어요.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState('');

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        keyword={keyword}
        onKeywordChange={setKeyword}
        onClose={onClose}
      >
        <ItemEditList
          keyword={keyword}
          items={items}
          recommendedItems={recommendedItems}
          onConfirm={onConfirm}
        />
      </ItemEditBody>
    </Modal>
  );
}

function ItemEditBody({ children, keyword, onKeywordChange, onClose }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {children}
    </>
  );
}
```

위의 예시처럼 `children`을 사용해 필요한 컴포넌트를 부모에서 작성하도록 하면 불필요한 Props Drilling을 줄일 수 있어요.

하지만, 조합 패턴만으로는 해결되지 않는 경우도 있고, 컴포넌트 트리 구조가 깊어지면 여전히 문제가 발생해요. 위의 예시에서 `ItemEditModal` 컴포넌트는 여전히 `items`와 `recommendedItems`를 Props Drilling하고 있어요.

## B. ContextAPI 활용

Context API를 활용하면, 데이터의 흐름을 간소화하고 계층 구조 전체에 쉽게 공유할 수 있어요.

조합 패턴을 사용해도, 컴포넌트가 복잡하고 깊다면, ContextAPI를 사용함으로써 불필요한 Props Drilling을 제거할 수 있어요.

```tsx
function ItemEditModal({ open, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState('');

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        keyword={keyword}
        onKeywordChange={setKeyword}
        onClose={onClose}
      >
        <ItemEditList keyword={keyword} onConfirm={onConfirm} />
      </ItemEditBody>
    </Modal>
  );
}

function ItemEditList({ keyword, onConfirm }) {
  const { items, recommendedItems } = useItemEditModalContext();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {children}
    </>
  );
}
```

```tip
ContextAPI를 사용하면 매우 쉽게 Props Drilling을 해결할 수 있지만, Props Drilling이 되는 모든 값을 ContextAPI로 관리해야 하는 것은 아니에요.

1. 컴포넌트는 props를 통해서 어떤 데이터를 사용할지 명확하게 표현해요.
컴포넌트의 역할과 의도를 담고 있는 props라면 문제가 되지 않을 수 있어요.

2. ContextAPI를 사용하기 전, children prop을 이용해서 컴포넌트를 전달해 depth를 줄일 수 있어요.
데이터를 사용하지 않는 단순히 값을 전달하기 위한 용도의 컴포넌트는 props가 컴포넌트의 역할과 의도를 나타내지 않을 수 있어요. 이러한 경우에 조합(Composition) 패턴을 사용한다면 불필요한 depth를 줄일 수 있어요.

위 내용을 먼저 고려를 해보고 접근 방법이 모두 맞지 않을 때 최후의 방법으로 ContextAPI를 사용해야 해요.

불필요한 Props Drilling을 제거하게 되면, 불필요한 중간 추상화를 제거하여 개발자가 컴포넌트의 역할과 의도를 명확히 이해할 수 있도록 도와줘요.
```

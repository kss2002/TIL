프론트엔드 개발을 하다 보면 Form으로 사용자에게 값을 입력받아야 하는 경우가 많아요. Form을 관리할 때는 2가지의 방법으로 응집도를 관리해서, 함께 수정되어야 할 코드가 함께 수정되도록 할 수 있어요.

## 필드 단위 응집도

필드 단위 응집은 개별 입력 요소를 독립적으로 관리하는 방식이에요. 각 필드가 고유의 검증 로직을 가지므로 변경이 필요한 범위가 줄어들어 특정 필드의 유지보수가 쉬워져요. 필드 단위의 응집도를 고려하여 설계하면, 각 필드의 검증 로직이 독립적이어서 다른 필드에 영향을 주지 않아요.

```tsx
import { useForm } from 'react-hook-form';

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = handleSubmit((formData) => {
    // 폼 데이터 제출 로직
    console.log('Form submitted:', formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register('name', {
            validate: (value) =>
              isEmptyStringOrNil(value) ? '이름을 입력해주세요.' : '',
          })}
          placeholder="이름"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email', {
            validate: (value) => {
              if (isEmptyStringOrNil(value)) {
                return '이메일을 입력해주세요.';
              }

              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return '유효한 이메일 주소를 입력해주세요.';
              }

              return '';
            },
          })}
          placeholder="이메일"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">제출</button>
    </form>
  );
}

function isNil(value: unknown): value is null | undefined {
  return value == null;
}

type NullableString = string | null | undefined;

function isEmptyStringOrNil(value: NullableString): boolean {
  return isNil(value) || value.trim() === '';
}
```

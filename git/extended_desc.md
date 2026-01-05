## vs code에서 Extended description 작성

깃허브에서 커밋 메세지를 작성할 때에, 밑에 Extended description를 기입하는 부분이 있다. 이것을 vs code에서도 할 수 있다.

<img src="/TIL/git/img/commit.png"></img>

1. 먼저, 밑의 명령어로 vs code에 commit_editmse가 열리게 만든다.

```bash
git config --global core.editor "code --wait"
## vs code를 기본 에디터로 설정하는 명령어
```

2. 명령어 기입 후에 설정이 잘 되었는지 확인한다.

```bash
git config --global core.editor
```

실행하면:

```
code --wait
```

위 사항이 출력되면 잘 설정된 것이다.

3. 이후 본인이 커밋하고자 하는 파일을 스테이징 추가하고 이후 git commit 명령어를 기입한다.

```bash
git commit
```

이후 다음과 같은 vs code의 COMMIT_EDITMSG탭이 열리게 된다.

4. COMMIT_EDITMSG

<img src="/TIL/git/img/preview.webp"></img>

참고: 지금 보이는 초록색 주석들(#로 시작)은 커밋에 포함되지 않는다.

그 밑의 빈 줄에만 메시지를 작성하면 된다.

### 작성 예시

```COMMIT_EDITMSG
feat: test file 추가

   테스트용 파일 추가했습니다.
   파일은 다음과 같은 기능을 합니다.

   ...
```

5. 이후 파일 저장 (Cmd + S 혹은 Ctrl + S)

6. vs code의 COMMIT_EDITMSG의 X 버튼을 눌러서 탭을 닫는디ㅏ.

7. 자동으로 터미널에서 커밋이 완료된다.

---

### 간단하게 Extended description 작성

상세 설명이 만일 심플하다면, 밑의 명령어로 간단하게 기입이 가능하다.

```bash
git commit -m "제목" -m "상세 설명"
```

# Claude for Chrome

**브라우저 안에서 동작하는 Claude 확장 프로그램.** 사이드 패널로 떠서 웹페이지를 읽고, 클릭하고, 탐색하며 사용자를 대신해 작업을 수행한다.

## 핵심 요소

- **사이드 패널** — 브라우징과 나란히 켜둔 채 대화로 작업 요청
- **웹 자동화** — 자연어로 사이트 탐색, 폼 작성, 데이터 추출, 멀티스텝 워크플로 실행
- **워크플로 학습** — 사용자가 직접 단계를 녹화하면 Claude가 반복 작업을 그대로 따라 함
- **Claude Code 연동** — 터미널에서 만들고 브라우저에서 검증, 콘솔 에러·DOM 상태를 Claude가 직접 읽어 디버깅
- **제공 범위** — 베타, 모든 유료 플랜(Pro·Max·Team·Enterprise)

## ⚠️ 보안 주의

브라우저를 대신 조작하므로 **프롬프트 인젝션** 위험이 있다. Anthropic의 적대적 테스트(123개 케이스)에서 안전장치 없이 노출 시 공격 성공률 23.6%로 측정됨 → 신뢰할 수 없는 사이트에서의 작업은 주의.

## 링크

- 제품 소개: https://claude.com/claude-for-chrome
- 출시 공지: https://www.anthropic.com/news/claude-for-chrome
- 시작 가이드: https://support.anthropic.com/en/articles/12012173-getting-started-with-claude-for-chrome

# Claude Developer Platform

개발자가 **API로 Claude를 직접 호출**하고 에이전트를 만들 수 있는 플랫폼. 단순 API 호출부터 도구 실행이 내장된 에이전트 SDK까지 제공한다.

## 핵심 요소

### Claude API (Client SDK)
- 프롬프트를 보내고 응답을 받는 직접 호출 방식
- 도구 실행(tool use)은 직접 구현
- Python, TypeScript 등 공식 SDK 제공

### Agent SDK
- **Claude Code의 능력을 코드로 가져온 SDK.** 도구 실행이 내장돼 있어 Claude가 코드베이스 이해·파일 편집·명령 실행 등을 자율 수행
- Client SDK와의 차이: 도구 실행을 Claude가 알아서 처리 (직접 구현 X)

```bash
# TypeScript / JavaScript
npm install @anthropic-ai/claude-agent-sdk

# Python
pip install claude-agent-sdk
```

### MCP (Model Context Protocol)
- 외부 도구·데이터 소스를 표준 방식으로 연결하는 오픈 프로토콜
- Claude Code / Cowork / Artifacts 등 전 제품이 공유

## 링크

- 플랫폼 문서: https://platform.claude.com/docs
- Agent SDK 개요: https://code.claude.com/docs/en/agent-sdk/overview
- Agent SDK (npm): https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk
- Python SDK: https://github.com/anthropics/claude-agent-sdk-python

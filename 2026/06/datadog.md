## Datadog이란?

Datadog은 인프라, 애플리케이션, 로그를 통합 관측하는 클라우드 기반 모니터링 플랫폼입니다.  
Datadog을 통해 웹/모바일 에러 추적, 페이지 로드 시간, API 응답 속도 등을 실시간으로 모니터링하며 성능 병목 지점을 발견하고 개선할 수 있습니다.
프론트엔드 관점에서 핵심이 되는 제품은 **RUM(Real User Monitoring)** 과 **APM(Application Performance Monitoring)** 입니다.

> 출처: [Datadog - What is APM?](https://www.datadoghq.com/product/apm/)

## 1. RUM (Real User Monitoring)

### 개념

> _"Datadog RUM은 웹 및 모바일 애플리케이션의 개별 사용자 활동과 실시간 경험에 대한 엔드투엔드 가시성을 제공합니다."_  
> — [Datadog RUM 공식 문서](https://docs.datadoghq.com/real_user_monitoring/)

RUM은 **실제 사용자의 브라우저/앱에서 일어나는 일**을 수집합니다. Lighthouse나 PageSpeed Insights 같은 "합성(Synthetic)" 측정과 달리, **실제 유저 환경** 데이터입니다.

### RUM이 다루는 4가지 영역

| 영역                  | 설명                                                       |
| --------------------- | ---------------------------------------------------------- |
| **Performance**       | 페이지 로드 시간, 네트워크 요청, 프론트엔드 코드 성능 추적 |
| **Error Management**  | 발생 중인 버그를 버전별·시간별로 추적                      |
| **Analytics / Usage** | 사용자 지역·디바이스·OS 분포, 사용자 여정 분석             |
| **Support**           | 특정 사용자의 세션을 재추적하여 지원팀의 MTTR 단축         |

> 출처: [Datadog RUM 공식 문서 - 개요](https://docs.datadoghq.com/real_user_monitoring/)

## 2. SDK 설치 방법 (Browser)

Browser RUM SDK는 세 가지 방식으로 주입할 수 있습니다.

| 방식          | 특징                                                                     |
| ------------- | ------------------------------------------------------------------------ |
| **npm**       | 모던 웹 앱 권장. 번들에 포함됨                                           |
| **CDN Async** | 성능 목표가 있는 앱 권장. SDK 로드가 페이지 로드 성능에 영향을 주지 않음 |
| **CDN Sync**  | 페이지 생애 주기 초반부터 모든 이벤트를 캡처하고 싶을 때                 |

> 출처: [Datadog Browser Monitoring Setup](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/setup/)

**Next.js 기준 npm 설치 예시:**

```bash
npm install @datadog/browser-rum
```

```ts
// _app.tsx 또는 layout.tsx
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID!,
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN!,
  site: 'datadoghq.com',
  service: 'my-next-app',
  env: 'production',
  trackInteractions: true,
  trackResources: true,
  trackLongTasks: true,
});
```

## 3. 페이지 로드 시간 추적 — Core Web Vitals

Datadog RUM은 모든 사용자 세션에서 **Core Web Vitals를 자동으로 수집**합니다.

> 출처: [Datadog Blog - Optimize Core Web Vitals with RUM](https://www.datadoghq.com/blog/rum-optimization/)

### 측정 지표 및 기준값

| 지표                      | 약어    | 측정 대상                                         | Good 기준   |
| ------------------------- | ------- | ------------------------------------------------- | ----------- |
| Largest Contentful Paint  | **LCP** | 최대 콘텐츠 요소 렌더링 시간 (로딩 성능)          | **≤ 2.5초** |
| Interaction to Next Paint | **INP** | 사용자 인터랙션 → 페이지 시각적 반응까지 시간     | **≤ 200ms** |
| Cumulative Layout Shift   | **CLS** | 예상치 못한 레이아웃 이동 누적 점수 (시각 안정성) | **≤ 0.1**   |
| First Contentful Paint    | **FCP** | 화면에 첫 콘텐츠가 렌더링되기까지의 시간          | —           |

> 출처: [Datadog RUM - Monitoring Page Performance](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/monitoring_page_performance/), [Datadog Blog - Core Web Vitals with RUM & Synthetics](https://www.datadoghq.com/blog/core-web-vitals-monitoring-datadog-rum-synthetics/)

> ⚠️ **주의:** 2024년 3월부터 FID(First Input Delay)는 공식 Core Web Vital에서 제외되고 **INP로 대체**되었습니다.  
> 출처: [Coralogix Docs - Core Web Vitals](https://coralogix.com/docs/user-guides/rum/product-features/core-web-vitals/)

### Optimization 페이지 활용

Datadog RUM의 **Optimization 페이지**는 각 Core Web Vital을 세부 단계로 분해하여 병목 지점을 특정합니다.

- **LCP 분해:** TTFB → 리소스 로드 지연 → 리소스 로드 시간 → 렌더 지연
- **INP 분해:** Input Delay → 처리 시간 → Presentation Delay
- Waterfall 시각화를 통해 어떤 리소스가 LCP를 지연시키는지 확인 가능

> 출처: [Datadog Docs - Optimizing Performance](https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/optimizing_performance/)

## 4. 에러 추적 (Error Tracking)

### 웹 에러

RUM은 JavaScript 에러를 자동 수집하며, **수천 개의 유사 에러를 하나의 "이슈"로 그룹핑**하여 노이즈를 줄입니다.

> _"Error Tracking은 수천 개의 유사 에러를 단일 이슈로 그룹핑함으로써 디버깅을 단순화합니다. 이슈는 스택 트레이스, 사용자 세션 타임라인, 사용자 위치·버전·커스텀 속성 등의 메타데이터를 포함합니다."_  
> 출처: [Datadog Docs - Error Tracking](https://docs.datadoghq.com/real_user_monitoring/error_tracking/)

- 에러가 처음 발생한 시점, 지속 여부, 발생 빈도 추적 가능
- JavaScript 에러를 **정확한 코드 라인까지** 핀포인팅

> 출처: [Datadog RUM 제품 페이지](https://www.datadoghq.com/product/real-user-monitoring/)

### 모바일 에러 (iOS, Android, React Native, Flutter)

Datadog Mobile RUM은 **Android, iOS, React Native, Flutter, Roku** 등을 지원합니다.

- **Crash Reporting:** 충돌 및 에러를 볼륨 기반으로 그룹핑
- **Symbolicated Reports:** 코드 라인 단위로 루트 원인 특정
- 각 플랫폼별 특화 KPI (예: iOS 앱의 Hang Rate) 추적

> 출처: [Datadog - Mobile RUM 제품 페이지](https://www.datadoghq.com/product/real-user-monitoring/mobile-rum/)

## 5. API 응답 속도 추적 — APM + RUM 연동

### APM (Application Performance Monitoring)

Datadog APM은 브라우저/모바일 앱부터 백엔드 서비스와 DB까지, **분산 트레이싱(Distributed Tracing)** 을 제공합니다.

> _"Datadog APM은 AI 기반 코드 레벨 분산 트레이싱을 브라우저·모바일 앱에서 백엔드 서비스·DB까지 제공하며, 트레이스를 로그, 메트릭, RUM 데이터와 원활하게 연동하여 근본 원인을 더 빠르게 감지하고 해결할 수 있게 합니다."_  
> 출처: [Datadog APM 제품 페이지](https://www.datadoghq.com/product/apm/)

### 핵심 APM 메트릭

| 메트릭                    | 설명               |
| ------------------------- | ------------------ |
| **Latency (p50/p90/p99)** | 응답 시간 백분위수 |
| **Throughput**            | 초당 요청 수 (RPS) |
| **Error Rate**            | 실패 요청 비율     |

> 출처: [The Fox Click - Datadog APM Cheat Sheet](https://thefoxclick.com/datadog-apm-cheat-sheet-complete-guide-to-application-performance-monitoring/)

### Flame Graph로 병목 특정

APM은 요청이 어떻게 실행되었는지를 **Flame Graph(플레임 그래프)** 로 시각화합니다. 개별 호출·쿼리가 전체 응답 지연에 얼마나 기여했는지 확인할 수 있습니다.

> 출처: [Datadog Docs - Getting Started with APM Tracing](https://docs.datadoghq.com/getting_started/tracing/)

### RUM ↔ APM 연동

RUM과 APM이 연동되면 **프론트엔드 요청 → 백엔드 트레이스를 원클릭으로 이동**하여 풀스택 병목을 분석할 수 있습니다.

```
사용자가 버튼 클릭
  → RUM: 네트워크 요청 지연 감지
    → APM: 해당 API 요청의 DB 쿼리에서 N+1 문제 발견
```

> 출처: [Datadog - Mobile RUM 제품 페이지](https://www.datadoghq.com/product/real-user-monitoring/mobile-rum/)

## 6. Session Replay

RUM은 **Session Replay** 기능으로 사용자의 브라우저 경험을 시각적으로 재현합니다.  
에러나 성능 이슈가 발생한 세션을 영상처럼 재생하여 재현(Reproduce) 비용을 낮춥니다.

> 출처: [Datadog RUM 공식 문서](https://docs.datadoghq.com/real_user_monitoring/)

## 7. 모니터링 → 개선 워크플로우

```
1. Datadog RUM 대시보드에서 Core Web Vitals 이상 감지
        ↓
2. Optimization 페이지에서 LCP/INP/CLS 세부 단계 분석
        ↓
3. Waterfall 뷰에서 느린 리소스/API 특정
        ↓
4. RUM → APM 연동으로 백엔드 트레이스 확인
        ↓
5. Flame Graph에서 DB 쿼리·서비스 호출 병목 발견
        ↓
6. 개선 후 RUM 지표 재확인 → 성능 회귀(Regression) 방지
```

> 출처: [Webeyez - Datadog APM Guide](https://webeyez.com/insights/guides/datadog-what-is-apm-guide)

## 8. 면접에서 이 항목을 설명할 때

이 내용을 포트폴리오에 기재했다면, 아래 질문들에 대비하세요.

- **"에러 추적을 어떻게 했나요?"** → RUM Error Tracking의 이슈 그룹핑, 스택 트레이스, 코드 라인 핀포인팅
- **"페이지 로드 시간은 어떻게 측정했나요?"** → Core Web Vitals(LCP, INP, CLS) 자동 수집, Optimization 페이지의 Waterfall
- **"API 응답 속도 병목은 어떻게 발견했나요?"** → APM의 Flame Graph, p90/p99 레이턴시, RUM↔APM 연동으로 프론트→백엔드 추적
- **"개선 전/후를 어떻게 비교했나요?"** → RUM 대시보드에서 버전별·기간별 지표 비교

## 참고 링크

| 문서                     | URL                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Datadog RUM 공식 문서    | https://docs.datadoghq.com/real_user_monitoring/                                      |
| Browser Monitoring Setup | https://docs.datadoghq.com/real_user_monitoring/application_monitoring/browser/setup/ |
| Core Web Vitals 모니터링 | https://www.datadoghq.com/blog/core-web-vitals-monitoring-datadog-rum-synthetics/     |
| RUM Optimization 페이지  | https://www.datadoghq.com/blog/rum-optimization/                                      |
| Error Tracking           | https://docs.datadoghq.com/real_user_monitoring/error_tracking/                       |
| APM 분산 트레이싱        | https://docs.datadoghq.com/tracing/                                                   |
| Mobile RUM               | https://www.datadoghq.com/product/real-user-monitoring/mobile-rum/                    |

import { BlockItem } from "../src/types/BlockItem";
import { generateRandomId } from "./generator.js";

export interface UserMessage {
  role: 'user';
  id: string;
  items: BlockItem[];
}

export interface AssistantMessage {
  role: 'assistant';
  id: string;
  items: BlockItem[];
}

export type Message = UserMessage | AssistantMessage;

export const messages: Message[] = [

  // ── User ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [
      {
        type: 'text',
        value: '오늘 서울의 날씨에 대해 알려줘. \n 그리고 이미지, 비디오, 지도, 차트 위젯도 보여줘. \n 마지막으로 프로그래밍 언어 비교표와 JSON 파싱 에러 UI 예시도 보고 싶어.'
      }
    ]
  },

  // ── Assistant (markdown/refs + widgets + table + reference + files) ──
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      // ── markdown: 날씨 (with refs) ──
      {
        type: 'markdown',
        value:
`## 오늘 날씨

오늘 서울의 날씨는 맑고 화창합니다. 기온은 약 22도 정도로 쾌적한 편이에요.

### 주요 특징
1. **맑은 하늘**: 구름이 거의 없고 햇빛이 잘 들어옵니다.
2. **쾌적한 기온**: 낮에는 따뜻하고 아침저녁으로는 선선합니다.
3. **바람**: 약간의 산들바람이 불어와 기분 좋은 날씨를 만들어줍니다.

예시 코드:

\`\`\`typescript
interface Weather {
  temperature: number;
  condition: string;
}
\`\`\`

더 자세한 내용은 기상청 웹사이트나 날씨뉴스를 참고해주세요.`,
        refs: [
          {
            label: '서울',
            startIndex: 9,
            endIndex: 11,
            sources: [
              {
                type: 'web',
                title: '서울특별시 기상 정보',
                url: 'https://www.kma.go.kr/weather/forecast/mid-term_01.jsp?stnId=109',
                snippet: '서울 지역의 현재 날씨는 맑음이며 기온은 22도를 기록하고 있습니다.',
                tags: ['queries: weather, seoul, korea'],
              }
            ]
          },
          {
            label: '기상청 웹사이트나 날씨뉴스',
            startIndex: 191,
            endIndex: 209,
            sources: [
              {
                type: 'web',
                title: '기상청 날씨 정보',
                url: 'https://www.kma.go.kr/weather/forecast/mid-term_01.jsp',
                snippet: "전국 날씨 예보 및 특보 정보를 제공합니다. 미세먼지 농도는 '보통' 수준을 유지하고 있습니다.",
                tags: ['date: 2024-06-15'],
              },
              {
                type: 'web',
                title: '오늘의 날씨 속보',
                url: 'https://news.example.com/weather/today',
                snippet: '전국적으로 맑은 날씨가 이어지며, 낮 최고기온은 23~25도 사이를 기록할 것으로 예상됩니다.',
              }
            ]
          }
        ]
      },

      // ── markdown: 위젯 (images, video, map, chart) ──
      {
        type: 'markdown',
        value:
`## 위젯 기능

다양한 위젯 기능들을 보여드리겠습니다.

### 1. 이미지 갤러리

\`\`\`block-json
{
  "tag": "u-images-block",
  "properties": {
    "items": [
      { "src": "https://picsum.photos/1600/1200?random=1", "alt": "Beautiful landscape", "caption": "Mountain view" },
      { "src": "https://picsum.photos/1600/1200?random=2", "alt": "City skyline", "caption": "Urban life" },
      { "src": "https://picsum.photos/1600/1200?random=3", "alt": "Ocean waves", "caption": "Peaceful ocean" },
      { "src": "https://picsum.photos/1600/1200?random=4", "alt": "Forest path", "caption": "Nature walk" }
    ]
  }
}
\`\`\`

### 2. 비디오 플레이어

\`\`\`block-json
{
  "tag": "u-video-block",
  "properties": {
    "src": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "ratio": "16:9"
  }
}
\`\`\`

### 3. 지도

\`\`\`block-json
{
  "tag": "u-map-block",
  "properties": {
    "lat": 37.5665,
    "lng": 126.9780,
    "zoom": 13,
    "label": "서울",
    "description": "대한민국의 수도"
  }
}
\`\`\`

### 4. 차트

\`\`\`block-json
{
  "tag": "u-chart-block",
  "properties": {
    "type": "bar",
    "data": {
      "labels": ["1월", "2월", "3월", "4월", "5월", "6월"],
      "datasets": [{
        "label": "판매량",
        "data": [12, 19, 15, 25, 22, 30],
        "backgroundColor": "rgba(54, 162, 235, 0.5)",
        "borderColor": "rgba(54, 162, 235, 1)",
        "borderWidth": 1
      }]
    },
    "options": {
      "responsive": true,
      "plugins": {
        "title": { "display": true, "text": "월별 판매 현황" },
        "legend": { "display": true, "position": "top" }
      },
      "scales": { "y": { "beginAtZero": true } }
    }
  }
}
\`\`\``
      },

      // ── markdown: 테이블 (가로 스크롤) ──
      {
        type: 'markdown',
        value:
`## 프로그래밍 언어 비교표

| 언어 | 패러다임 | 타입 시스템 | 주요 용도 | 런타임 | 학습 난이도 | 성능 | GC | 동시성 모델 | 첫 릴리스 | 최신 버전 | 라이선스 |
|:---|:---:|:---:|:---|:---|:---:|---:|:---:|:---|---:|:---:|:---|
| TypeScript | 멀티 | 정적(옵션) | 웹 프론트/백엔드 | Node.js / 브라우저 | 중 | 중 | O | Async/Await | 2012 | 5.4 | Apache 2.0 |
| Python | 멀티 | 동적 | AI/데이터 분석 | CPython / PyPy | 하 | 중하 | O | AsyncIO / GIL | 1991 | 3.13 | PSF |
| Rust | 멀티 | 정적 | 시스템 프로그래밍 | 네이티브 | 상 | 최상 | X | Ownership | 2015 | 1.78 | MIT / Apache 2.0 |
| Go | 멀티 | 정적 | 백엔드/클라우드 | 네이티브 | 중하 | 상 | O | Goroutine | 2009 | 1.22 | BSD |
| Kotlin | 멀티 | 정적 | Android/JVM | JVM / 네이티브 | 중 | 상 | O | Coroutine | 2016 | 2.0 | Apache 2.0 |
| Swift | 멀티 | 정적 | iOS/macOS | 네이티브 | 중 | 상 | ARC | Async/Await | 2014 | 5.10 | Apache 2.0 |
| Java | 객체지향 | 정적 | 엔터프라이즈/Android | JVM | 중 | 상 | O | Thread / Virtual | 1995 | 21 | GPL |
| C# | 멀티 | 정적 | 게임/엔터프라이즈 | .NET | 중 | 상 | O | Async/Await | 2000 | 12 | MIT |
| Ruby | 멀티 | 동적 | 웹 백엔드 | MRI / JRuby | 하 | 중하 | O | Thread / Fiber | 1995 | 3.3 | Ruby |
| PHP | 멀티 | 동적 | 웹 백엔드 | Zend / HHVM | 하 | 중 | O | 동기 | 1994 | 8.3 | PHP |
| C++ | 멀티 | 정적 | 게임/임베디드 | 네이티브 | 상 | 최상 | X | Thread / Coroutine | 1985 | C++23 | — |
| Scala | 멀티 | 정적 | 빅데이터/함수형 | JVM | 상 | 상 | O | Akka / Future | 2004 | 3.4 | Apache 2.0 |
| Dart | 멀티 | 정적 | 모바일/웹(Flutter) | VM / JS | 중하 | 상 | O | Isolate | 2011 | 3.3 | BSD |
| Haskell | 함수형 | 정적 | 학술/금융 | GHC | 최상 | 상 | O | STM / Lightweight | 1990 | GHC 9.8 | BSD |
| Zig | 절차적 | 정적 | 시스템 프로그래밍 | 네이티브 | 상 | 최상 | X | Async | 2016 | 0.12 | MIT |`
      },

      // ── markdown: 테이블 셀 내 인라인 마크다운 회귀 테스트 (v0.5.0 fix) ──
      {
        type: 'markdown',
        value:
`## 테이블 셀 인라인 마크다운

| 단계 | 작업 | 명령어 |
|------|------|--------|
| 1 | **IKE 설정** | \`set security ike policy ike-1 mode main\`<br>\`set security ike policy ike-1 proposal set standard\` |
| 2 | *강조* 및 ~~취소선~~ | \`cli --dry-run\` |
| 3 | [링크](https://example.com) | \`run\` |
`
      },

      // ── markdown: JSON 파싱 에러 + 파일 분석 ──
      {
        type: 'markdown',
        value:
`## JSON 파싱 에러 UI

\`<script type="application/json">\` 내용이 올바른 JSON이 아니면 아래처럼 에러 UI가 표시됩니다.

<u-table-block><script type="application/json">{ headers: broken, json }</script></u-table-block>
`
      },

      // ── reference ──
      {
        type: 'reference',
        sources: [
          {
            type: 'web',
            title: 'Top AI Trends in 2024',
            url: 'https://example.com/ai-trends',
            snippet: 'An overview of the top AI technology trends to watch in 2024, including advancements in large language models and generative AI.',
          },
          {
            type: 'web',
            title: 'The Future of Large Language Models',
            url: 'https://example.com/llm-future',
            snippet: 'A deep dive into the future developments and applications of large language models in various industries.',
          },
          {
            type: 'document',
            title: 'Attention Is All You Need',
            snippet: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder.',
          }
        ]
      }
    ]
  }
]
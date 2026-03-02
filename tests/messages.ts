import { VoteValue } from "../src/components/buttons/UVoteButton.component.js";
import { ActionSchema } from "../src/types/Actions.js";
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
  voteValue?: VoteValue;
}

/**
 * LLM 응답의 action-json 블록에서 추출되어 생성됩니다.
 */
export interface ActionMessage {
  role: 'action';
  id: string;
  items: ActionSchema[];
}

export type Message = UserMessage | AssistantMessage | ActionMessage;

export const messages: Message[] = [

  // ── 날씨 (thinking + tool + markdown with refs + vote) ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value: '안녕하세요! 오늘 날씨 어때요?' }]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'thinking',
        value: '사용자가 날씨 정보를 요청했습니다. 현재 위치를 확인하고 날씨 API를 호출해야 합니다.'
      },
      {
        type: 'tool',
        title: 'Search Weather API',
        input: { location: 'Seoul', date: '2024-06-15' },
        output: { temperature: 22, condition: '맑음', humidity: 65, wind_speed: 2.5 },
      },
      {
        type: 'markdown',
        value:
`안녕하세요! 오늘 서울의 날씨는 맑고 화창합니다. 기온은 약 22도 정도로 쾌적한 편이에요.

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
            startIndex: 8,
            endIndex: 10,
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
      }
    ],
    voteValue: 'up'
  },

  // ── AI 트렌드 (thinking + tools + markdown with refs + reference block) ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value: '최근 AI 기술 트렌드에 대해 알려주고, 관련 논문도 찾아줘.' }]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'thinking',
        value: 'AI 기술 트렌드를 조사하고 관련 논문을 검색해야 합니다. 웹 검색과 학술 데이터베이스를 확인하겠습니다.'
      },
      {
        type: 'tool',
        title: 'Web Search',
        input: { query: 'AI technology trends 2024', max_results: 5 },
        output: {
          results: [
            { title: 'Top AI Trends in 2024', url: 'https://example.com/ai-trends' },
            { title: 'The Future of Large Language Models', url: 'https://example.com/llm-future' }
          ]
        },
      },
      {
        type: 'tool',
        title: 'Academic Paper Search',
        input: { query: 'transformer models recent advances', database: 'arxiv' },
        output: {
          papers: [
            { title: 'Attention Is All You Need', arxiv_id: '1706.03762' },
            { title: 'GPT-4 Technical Report', arxiv_id: '2303.08774' }
          ],
          count: 2
        },
      },
      {
        type: 'markdown',
        value:
`2024년 현재 주목받고 있는 **AI 기술 트렌드**를 정리해드립니다.

## 주요 트렌드

### 1. 대규모 언어 모델 (LLM)
- GPT-4, Claude, Gemini 등 강력한 모델들이 등장
- 멀티모달 기능 통합 (텍스트, 이미지, 음성)
- 더 효율적인 추론 능력 향상

### 2. 생성형 AI
- 이미지 생성: DALL-E, Midjourney, Stable Diffusion
- 비디오 생성: Sora, Runway
- 코드 생성: GitHub Copilot, Cursor

### 3. 에이전트 AI
- 자율적으로 작업을 수행하는 AI 에이전트
- 도구 사용 능력 (Tool Use)
- 멀티 에이전트 협업

## 관련 논문

1. **"Attention Is All You Need"** - Transformer 아키텍처의 기초
2. **"GPT-4 Technical Report"** - 최신 LLM 기술 상세 설명

더 많은 정보는 학술 데이터베이스에서 확인하실 수 있습니다.`,
        refs: [
          {
            label: 'GPT-4',
            startIndex: 61,
            endIndex: 66,
            sources: [
              {
                type: 'document',
                url: 'https://arxiv.org/abs/2303.08774',
                title: 'GPT-4 Technical Report',
                snippet: 'We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and emit text outputs.',
                tags: ['score: 0.95', 'page: 1'],
              },
              {
                type: 'web',
                url: 'https://openai.com/research/gpt-4',
                title: 'GPT-4 Research Overview',
                snippet: 'GPT-4 is OpenAI\'s most advanced system, producing safer and more useful responses.',
              }
            ]
          },
          {
            label: 'Claude',
            startIndex: 68,
            endIndex: 74,
            sources: [
              {
                type: 'web',
                url: 'https://www.anthropic.com/claude',
                title: 'Claude - AI Assistant by Anthropic',
                snippet: 'Claude is a next-generation AI assistant based on Anthropic\'s research into training helpful, honest, and harmless AI systems.',
              }
            ]
          },
          {
            label: 'Transformer 아키텍처',
            startIndex: 330,
            endIndex: 348,
            sources: [
              {
                type: 'document',
                url: 'https://arxiv.org/abs/1706.03762',
                title: 'Attention Is All You Need',
                snippet: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder.',
                tags: ['score: 0.98', 'chunk: 1', 'publish: 2017-06-12'],
              },
              {
                type: 'document',
                url: 'https://arxiv.org/abs/2005.14165',
                title: 'A Survey on Transformer Models',
                snippet: 'Transformers have become the de facto standard for natural language processing tasks, outperforming previous state-of-the-art models.',
                tags: ['score: 0.87', 'chunk: 3', 'author: Lin et al.'],
              }
            ]
          },
          {
            label: '학술 데이터베이스',
            startIndex: 403,
            endIndex: 413,
            sources: [
              {
                type: 'web',
                url: 'https://arxiv.org/list/cs.AI/recent',
                title: 'arXiv.org - Artificial Intelligence',
                snippet: 'arXiv is a free distribution service and an open-access archive for scholarly articles in physics, mathematics, computer science, and more.',
                tags: ['research', 'open-access'],
              },
              {
                type: 'web',
                url: 'https://scholar.google.com',
                title: 'Google Scholar',
                snippet: 'Google Scholar provides a simple way to broadly search for scholarly literature across many disciplines and sources.',
              },
              {
                type: 'web',
                url: 'https://www.semanticscholar.org',
                title: 'Semantic Scholar - AI-Powered Research Tool',
                snippet: 'Semantic Scholar uses AI to help researchers find relevant papers and understand scientific literature.',
                tags: ['research', 'semantic-search'],
              }
            ]
          }
        ]
      },
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
    ],
    voteValue: 'none'
  },

  // ── 위젯 (images, video, map, chart) ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value: '위젯 기능들을 보여줘' }]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'markdown',
        value:
`네! 다양한 위젯 기능들을 보여드리겠습니다.

## 1. 이미지 갤러리

\`\`\`widget-json
{
  "tag": "u-images-widget",
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

## 2. 비디오 플레이어

\`\`\`widget-json
{
  "tag": "u-video-widget",
  "properties": {
    "src": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "ratio": "16:9"
  }
}
\`\`\`

## 3. 지도

\`\`\`widget-json
{
  "tag": "u-map-widget",
  "properties": {
    "lat": 37.5665,
    "lng": 126.9780,
    "zoom": 13,
    "label": "서울",
    "description": "대한민국의 수도"
  }
}
\`\`\`

## 4. 차트

\`\`\`widget-json
{
  "tag": "u-chart-widget",
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
      }
    ]
  },

  // ── 테이블 (가로 스크롤) ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value: '주요 프로그래밍 언어 비교 표를 보여줘.' }]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'markdown',
        value:
`주요 프로그래밍 언어 비교표입니다.

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
      }
    ]
  },

  // ── JSON 파싱 에러 UI ──
  {
    id: generateRandomId(),
    role: 'user',
    items: [{ type: 'text', value: 'JSON 파싱 에러가 나면 어떻게 보여?' }]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'markdown',
        value: '`<script type="application/json">` 내용이 올바른 JSON이 아니면 아래처럼 에러 UI가 표시됩니다.\n\n<u-table-block><script type="application/json">{ headers: broken, json }</script></u-table-block>'
      }
    ]
  },
  {
    id: generateRandomId(),
    role: 'user',
    items: [
      { type: 'text', value: '이 파일들 분석해줄 수 있어?' },
      {
        type: 'files',
        files: [
          { name: 'report-2026.pdf', size: 2_457_600, type: 'application/pdf' },
          { name: 'data.csv', size: 84_320, type: 'text/csv', downloadUrl: 'https://example.com/data.csv' },
        ]
      }
    ]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'markdown',
        value:
`첨부하신 파일들을 분석했습니다.

### 📄 report-2026.pdf (2.3 MB)
- 전체 32페이지 분량의 보고서입니다.
- 주요 내용: Q1 실적 요약, 시장 분석, 향후 전략

### 📊 data.csv (82 KB)
- 총 1,240개의 레코드가 포함되어 있습니다.
- 컬럼 구성: \`date\`, \`product\`, \`revenue\`, \`units_sold\`

추가로 분석이 필요한 부분이 있으면 알려주세요!`
      }
    ]
  }
]
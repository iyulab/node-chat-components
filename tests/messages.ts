import { VoteValue } from "../src/components/buttons/UVoteButton.component.js";
import { BlockItem, TextBlockItem } from "../src/types/BlockItem";
import { generateRandomId } from "./generator.js";

export interface UserMessage {
  role: 'user';
  id: string;
  items: TextBlockItem[];
}

export interface AssistantMessage {
  role: 'assistant';
  id: string;
  items: BlockItem[];
  voteValue?: VoteValue;
}

export type Message = UserMessage | AssistantMessage;

export const messages: Message[] = [
  {
    id: generateRandomId(),
    role: 'user',
    items: [
      {
        type: 'text',
        value: '안녕하세요! 오늘 날씨 어때요?'
      }
    ]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'thinking',
        value: `사용자가 날씨 정보를 요청했습니다. 현재 위치를 확인하고 날씨 API를 호출해야 합니다.`
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
            label: "서울",
            startIndex: 8,
            endIndex: 10,
            sources: [
              {
                type: 'web',
                title: "서울특별시 기상 정보",
                url: "https://www.kma.go.kr/weather/forecast/mid-term_01.jsp?stnId=109",
                snippet: "서울 지역의 현재 날씨는 맑음이며 기온은 22도를 기록하고 있습니다.",
                tags: ["queries: weather, seoul, korea"]
              }
            ]
          },
          {
            label: "기상청 웹사이트나 날씨뉴스",
            startIndex: 191,
            endIndex: 209,
            sources: [
              {
                type: 'web',
                title: "기상청 날씨 정보",
                url: "https://www.kma.go.kr/weather/forecast/mid-term_01.jsp",
                snippet: "전국 날씨 예보 및 특보 정보를 제공합니다. 미세먼지 농도는 '보통' 수준을 유지하고 있습니다.",
                tags: ["date: 2024-06-15"]
              },
              {
                type: 'web',
                title: "오늘의 날씨 속보",
                url: "https://news.example.com/weather/today",
                snippet: "전국적으로 맑은 날씨가 이어지며, 낮 최고기온은 23~25도 사이를 기록할 것으로 예상됩니다.",
              }
            ]
          }
        ]
      },
    ],
    voteValue: 'up'
  },
  {
    id: generateRandomId(),
    role: 'user',
    items: [
      {
        type: 'text',
        value: '최근 AI 기술 트렌드에 대해 알려주고, 관련 논문도 찾아줘.'
      }
    ]
  },
  {
    id: generateRandomId(),
    role: 'assistant',
    items: [
      {
        type: 'thinking',
        value: `AI 기술 트렌드를 조사하고 관련 논문을 검색해야 합니다. 웹 검색과 학술 데이터베이스를 확인하겠습니다.`
      },
      {
        type: 'tool',
        title: 'Web Search',
        input: { 
          query: "AI technology trends 2024",
          max_results: 5
        },
        output: {
          results: [
            { title: "Top AI Trends in 2024", url: "https://example.com/ai-trends" },
            { title: "The Future of Large Language Models", url: "https://example.com/llm-future" }
          ]
        },
      },
      {
        type: 'tool',
        title: 'Academic Paper Search',
        input: { 
          query: "transformer models recent advances",
          database: "arxiv"
        },
        output: { 
          papers: [
            { title: "Attention Is All You Need", arxiv_id: "1706.03762" },
            { title: "GPT-4 Technical Report", arxiv_id: "2303.08774" }
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

주요 논문들을 확인해보세요:

1. **"Attention Is All You Need"** - Transformer 아키텍처의 기초
2. **"GPT-4 Technical Report"** - 최신 LLM 기술 상세 설명

더 많은 정보는 학술 데이터베이스에서 확인하실 수 있습니다.`,
        refs: [
          {
            label: "GPT-4",
            startIndex: 61,
            endIndex: 66,
            sources: [
              {
                type: 'document',
                url: "https://arxiv.org/abs/2303.08774",
                title: "GPT-4 Technical Report",
                snippet: "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and emit text outputs.",
                tags: ["score: 0.95", "page: 1"]
              },
              {
                type: 'web',
                url: "https://openai.com/research/gpt-4",
                title: "GPT-4 Research Overview",
                snippet: "GPT-4 is OpenAI's most advanced system, producing safer and more useful responses.",
              }
            ]
          },
          {
            label: "Claude",
            startIndex: 68,
            endIndex: 74,
            sources: [
              {
                type: 'web',
                url: "https://www.anthropic.com/claude",
                title: "Claude - AI Assistant by Anthropic",
                snippet: "Claude is a next-generation AI assistant based on Anthropic's research into training helpful, honest, and harmless AI systems.",
              }
            ]
          },
          {
            label: "Transformer 아키텍처",
            startIndex: 330,
            endIndex: 348,
            sources: [
              {
                type: 'document',
                url: "https://arxiv.org/abs/1706.03762",
                title: "Attention Is All You Need",
                snippet: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.",
                tags: ["score: 0.98", "chunk: 1", "publish: 2017-06-12"]
              },
              {
                type: 'document',
                url: "https://arxiv.org/abs/2005.14165",
                title: "A Survey on Transformer Models",
                snippet: "Transformers have become the de facto standard for natural language processing tasks, outperforming previous state-of-the-art models.",
                tags: ["score: 0.87", "chunk: 3", "author: Lin et al."]
              }
            ]
          },
          {
            label: "학술 데이터베이스",
            startIndex: 403,
            endIndex: 413,
            sources: [
              {
                type: 'web',
                // url: "https://arxiv.org/list/cs.AI/recent",
                title: "arXiv.org - Artificial Intelligence",
                snippet: "arXiv is a free distribution service and an open-access archive for scholarly articles in physics, mathematics, computer science, and more.",
                tags: ["research", "open-access"]
              },
              {
                type: 'web',
                url: "https://scholar.google.com",
                title: "Google Scholar",
                snippet: "Google Scholar provides a simple way to broadly search for scholarly literature across many disciplines and sources.",
              },
              {
                type: 'web',
                url: "https://www.semanticscholar.org",
                title: "Semantic Scholar - AI-Powered Research Tool",
                snippet: "Semantic Scholar uses AI to help researchers find relevant papers and understand scientific literature.",
                tags: ["research", "semantic-search"]
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
            title: "Top AI Trends in 2024",
            url: "https://example.com/ai-trends",
            snippet: "An overview of the top AI technology trends to watch in 2024, including advancements in large language models and generative AI.",
          },
          {
            type: 'web',
            title: "The Future of Large Language Models",
            url: "https://example.com/llm-future",
            snippet: "A deep dive into the future developments and applications of large language models in various industries.",
          },
          {
            type: 'document',
            title: "Attention Is All You Need",
            snippet: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism.",
          }
        ]
      }
    ],
    voteValue: 'none'
  },
  // 위젯 테스트 메시지들
  {
    id: generateRandomId(),
    role: 'user',
    items: [
      {
        type: 'text',
        value: '위젯 기능들을 보여줘'
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
`네! 다양한 위젯 기능들을 보여드리겠습니다.

## 1. 이미지 갤러리

아름다운 풍경 사진들을 갤러리로 보여드립니다:

\`\`\`widget-json
{
  "tag": "u-images-widget",
  "properties": {
    "items": [
      {
        "src": "https://picsum.photos/400/300?random=1",
        "alt": "Beautiful landscape",
        "caption": "Mountain view"
      },
      {
        "src": "https://picsum.photos/400/300?random=2",
        "alt": "City skyline",
        "caption": "Urban life"
      },
      {
        "src": "https://picsum.photos/400/300?random=3",
        "alt": "Ocean waves",
        "caption": "Peaceful ocean"
      },
      {
        "src": "https://picsum.photos/400/300?random=4",
        "alt": "Forest path",
        "caption": "Nature walk"
      }
    ]
  }
}
\`\`\`

## 2. 비디오 플레이어

재미있는 영상을 보여드립니다:

\`\`\`widget-json
{
  "tag": "u-video-widget",
  "properties": {
    "src": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "ratio": "16:9"
  }
}
\`\`\`

## 3. 추천 질문

더 궁금한 내용이 있으신가요?

\`\`\`widget-json
{
  "tag": "u-questions-widget",
  "properties": {
    "questions": [
      "AI 기술의 미래는?",
      "프로그래밍 언어 추천해줘",
      "건강한 식단 알려줘",
      "여행지 추천 부탁해"
    ]
  }
}
\`\`\`

## 4. 지도

서울의 위치를 지도로 보여드립니다:

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

## 5. 차트

월별 판매 데이터를 차트로 보여드립니다:

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
        "title": {
          "display": true,
          "text": "월별 판매 현황"
        },
        "legend": {
          "display": true,
          "position": "top"
        }
      },
      "scales": {
        "y": {
          "beginAtZero": true
        }
      }
    }
  }
}
\`\`\`

이렇게 다양한 위젯들을 사용할 수 있습니다!`
      }
    ]
  }
]
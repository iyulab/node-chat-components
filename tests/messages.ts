import { VoteValue } from "../src/components/buttons/UVoteButton.component.js";
import { BlockItem, CitationSource } from "../src/components/message/UMessage.types.js";

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  items: BlockItem[];
  citations?: CitationSource[];
  voteValue?: VoteValue;
}

export const messages: Message[] = [
  {
    id: 0,
    role: 'user',
    items: [
      {
        type: 'text',
        value: '안녕하세요! 오늘 날씨 어때요?'
      }
    ]
  },
  {
    id: 1,
    role: 'assistant',
    items: [
      {
        type: 'thinking',
        value: `잠시만 기다려 주세요...`
      },
      {
        type: 'tool',
        title: 'Search Weather API',
        input: JSON.stringify({ location: 'Seoul', date: '2024-06-15' }),
        output: JSON.stringify({ temperature: 22, condition: '맑음' }),
      },
      {
        type: 'markdown',
        value: 
`
안녕하세요! 오늘 날씨는 맑고 화창합니다. 기온은 약 22도 정도로 쾌적한 편이에요.
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
더 자세한 내용은 기상청 웹사이트를 참고해주세요.
`,
        refs: [
          {
            citationId: 0,
            startIndex: 145,
            endIndex: 156
          },
          {
            citationId: 1,
            startIndex: 280,
            endIndex: 295
          }
        ]
      },
    ],
    citations: [
      {
        type: 'web',
        title: "기상청 날씨 정보",
        snippet: "오늘 서울 지역의 날씨는 맑고 기온은 22도입니다. 미세먼지 농도는 '보통' 수준을 유지하고 있습니다.",
        url: "https://www.kma.go.kr/weather/forecast/mid-term_01.jsp"
      },
      {
        type: 'web',
        title: "오늘의 날씨 뉴스",
        snippet: "전국적으로 맑은 날씨가 이어지며, 낮 최고기온은 23~25도 사이를 기록할 것으로 예상됩니다.",
        url: "https://news.example.com/todays-weather"
      }
    ],
    voteValue: 'none'
  }
]
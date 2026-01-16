import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses.mjs';
import type { Message } from "./messages";
import type { BlockItem } from '../src/types/BlockItem';
import type { BlockReference } from '../src/types/BlockReference';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 사용하기 위해 필요
});

export async function generateMessage(messages: Message[], signal: AbortSignal): Promise<Message> {
  // Message 배열을 입력 텍스트로 변환
  const input = messages.reduce<ResponseInput>((acc, msg) => {
    if (msg.role !== 'user' && msg.role !== 'assistant') {
      return acc; // skip
    }

    const content = msg.items
      .filter(item => item.type === 'text' || item.type === 'markdown')
      .map((item: any) => item.value)
      .join('\n\n');

    acc.push({
      type: 'message',
      role: msg.role,
      content
    });

    return acc;
  }, []);

  const response = await openai.responses.create({
    model: 'gpt-5-mini',
    include: [
      'reasoning.encrypted_content',
      'web_search_call.action.sources',
      'web_search_call.results',
    ],
    input: input,
    reasoning: {
      effort: 'medium', 
      summary: 'detailed' 
    },
    tools: [
      { type: 'web_search' },
    ],
    tool_choice: 'auto',
    truncation: 'auto',
  }, {
    signal: signal
  });
  console.log('Generated response:', response);
  
  const blocks = response.output.reduce<BlockItem[]>((acc, output) => { {
    if (output.type === 'reasoning') {
      const summary = output.summary
        .filter(s => s.type === 'summary_text' && s.text)
        .map(s => s.text)
        .join('\n\n\n');
      if (!summary) return acc;
      
      // 이미 thinking 블록이 있으면 내용 추가, 없으면 새로 추가
      const existing = acc.find(b => b.type === 'thinking');
      if (existing) {
        existing.value += '\n\n\n' + summary;
      } else {
        acc.push({ type: 'thinking', value: summary });
      }
    } else if (output.type === 'message') {
      let text: string = "";
      let refs: BlockReference[] = [];
      output.content.filter(c => c.type === 'output_text').map(c => {
        text += c.text;
        c.annotations.map(a => {
          if (a.type === 'url_citation') {
            refs.push({
              name: a.title,
              startIndex: a.start_index,
              endIndex: a.end_index,
              sources: [
                {
                  type: 'web',
                  url: a.url,
                  title: a.title,
                }
              ]
            })
          }
        })
      });
      acc.push({
        type: 'markdown',
        value: text,
        refs: refs
      });
    } else if (output.type === 'web_search_call') {
      const action = (output as any).action;
      if (action.type === 'search') {
        acc.push({
          type: 'tool',
          title: 'Web Search',
          input: {
            queries: action.queries,
          },
          output: {
            sources: action.sources,
          }
        });
      } else if (action.type === 'open_page') {
        acc.push({
          type: 'tool',
          title: 'Web Page Open',
          input: {
            url: action.url,
          }
        });
      } else {
        acc.push({
          type: 'tool',
          title: 'Web Search Action',
          input: action,
        });
      }
    }
    return acc;
  }}, []);

  return {
    id: generateRandomId(),
    role: 'assistant',
    items: blocks
  }
}

export function generateRandomId(): string {
  if (window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  } else {
    // 간단한 랜덤 ID 생성
    return 'xxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
  }
}
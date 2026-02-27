import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses.mjs';
import type { Message } from "./messages";
import type { BlockItem } from '../src/types/BlockItem';
import { WidgetRegistry } from '../src/utilities/WidgetRegistry.js';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 사용하기 위해 필요
});

export async function* generateMessageStream(
  messages: Message[], 
  signal: AbortSignal
): AsyncGenerator<Message, void, unknown> {
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

  // 시스템 메시지로 widget instruction 추가
  input.unshift({
    type: 'message',
    role: 'system',
    content: `You are a helpful AI assistant that can use various widgets to enhance your responses.\n\n${WidgetRegistry.buildPrompt()}`
  });

  const stream = await openai.responses.create({
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
    stream: true,
  }, {
    signal: signal
  });
  
  const blocks: BlockItem[] = [];
  const messageId = generateRandomId();

  try {
    for await (const event of stream) {
      const eventType = (event as any).type;
      if (!eventType) continue;

      let shouldYield = false;

      // delta 이벤트 처리 (텍스트 스트리밍)
      if (eventType === 'response.output_text.delta' || eventType === 'response.reasoning_summary_text.delta') {
        const deltaText = (event as any).delta;
        
        if (deltaText && typeof deltaText === 'string') {
          // reasoning delta
          if (eventType === 'response.reasoning_summary_text.delta') {
            const existing = blocks.find(b => b.type === 'thinking');
            if (existing) {
              existing.value += deltaText;
            } else {
              blocks.push({ type: 'thinking', value: deltaText });
            }
          }
          // output text delta  
          else if (eventType === 'response.output_text.delta') {
            const existing = blocks.find(b => b.type === 'markdown');
            if (existing) {
              existing.value += deltaText;
            } else {
              blocks.push({ type: 'markdown', value: deltaText, refs: [] });
            }
          }
          
          // delta는 즉시 yield
          yield {
            id: messageId,
            role: 'assistant',
            items: [...blocks]
          };
          continue;
        }
      }

      // output_item 관련 이벤트 처리
      if (eventType.includes('output_item') && !eventType.includes('delta')) {
        const item = (event as any).item || (event as any).output_item;
        if (!item) continue;

        // done 이벤트는 무시 (delta로 이미 처리됨)
        if (eventType === 'response.output_item.done') {
          continue;
        }

        // reasoning 블록 초기화
        if (eventType === 'response.output_item.added' && item.type === 'reasoning') {
          if (!blocks.find(b => b.type === 'thinking')) {
            blocks.push({ type: 'thinking', value: '' });
          }
        }
        // message 블록 초기화
        else if (eventType === 'response.output_item.added' && item.type === 'message') {
          if (!blocks.find(b => b.type === 'markdown')) {
            blocks.push({ type: 'markdown', value: '', refs: [] });
          }
        }
        // web_search_call 블록 처리
        else if (item.type === 'web_search_call') {
          const action = (item as any).action;
          if (action) {
            if (action.type === 'search') {
              blocks.push({
                type: 'tool',
                title: 'Web Search',
                input: { queries: action.queries },
                output: { sources: action.sources },
              });
            } else if (action.type === 'open_page') {
              blocks.push({
                type: 'tool',
                title: 'Web Page Open',
                input: { url: action.url },
              });
            } else {
              blocks.push({
                type: 'tool',
                title: 'Web Search Action',
                input: action,
              });
            }
            shouldYield = true;
          }
        }
      }
      
      // 일반 이벤트 yield
      if (shouldYield && blocks.length > 0) {
        yield {
          id: messageId,
          role: 'assistant',
          items: [...blocks]
        };
      }
    }
  } catch (error) {
    if (signal.aborted) {
      throw new Error('Request was aborted.');
    }
    throw error;
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
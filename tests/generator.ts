import OpenAI from 'openai';
import type { ResponseInput, ResponseInputContent, ResponseOutputMessage, ResponseOutputText } from 'openai/resources/responses/responses.mjs';
import type { AssistantMessage, Message } from "./messages";
import type { BlockItem } from '../src/types/BlockItem';
import { ReferenceCitation } from '../src';

export interface ResponseOptions {
  model?: string;
  reasoningEffort?: string;
  reasoningSummary?: 'auto' | 'concise' | 'detailed';
  toolChoice?: 'auto' | 'required' | 'none';
  truncation?: 'auto' | 'disabled';
  webSearch?: boolean;
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 사용하기 위해 필요
});

export async function* generateStreamingMessage(
  messages: Message[],
  instructions?: string,
  signal?: AbortSignal,
  options?: ResponseOptions,
): AsyncGenerator<AssistantMessage, void, unknown> {
  // Message 배열을 입력 텍스트로 변환
  const input = messages.reduce<ResponseInput>((acc, msg) => {
    if (msg.role === 'user') {
      acc.push({
        type: 'message',
        role: msg.role,
        content: msg.items.map(item => {
          if (item.type === 'text') {
            return {
              type: 'input_text',
              text: item.value,
            };
          }
          if (item.type === 'file') {
            if (item.mimeType?.startsWith('image/')) {
              return {
                type: 'input_image',
                image_url: item.data,
              };
            } else {
              return {
                type: 'input_file',
                filename: item.name,
                file_data: item.data,
              };
            }
          }
          return null; // skip non-text items
        }).filter(Boolean) as ResponseInputContent[],
      });
    } else if (msg.role === 'assistant') {
      acc.push({
        type: 'message',
        role: msg.role,
        content: msg.items.map(item => {
          if (item.type === 'markdown') {
            return {
              type: 'output_text',
              text: item.value,
            };
          }
          return null; // skip non-markdown items
        }).filter(Boolean) as ResponseOutputText[],
      }as ResponseOutputMessage);
    }
    return acc;
  }, []);

  const tools = options?.webSearch !== false
    ? [{ type: 'web_search' as const }]
    : [];

  const stream = await openai.responses.create({
    model: options?.model ?? 'gpt-5-nano',
    instructions: instructions,
    include: [
      'reasoning.encrypted_content',
      'web_search_call.action.sources',
      // 'web_search_call.results',
    ],
    input: input,
    reasoning: {
      effort: options?.reasoningEffort as any ?? 'none',
      summary: options?.reasoningSummary ?? 'detailed',
    },
    tools: tools,
    tool_choice: options?.toolChoice ?? 'auto',
    truncation: options?.truncation ?? 'auto',
    stream: true,
  }, {
    signal: signal
  });
  
  const blocks: BlockItem[] = [];
  const messageId = generateRandomId();

  try {
    for await (const event of stream) {
      console.log('event:', event);

      let shouldYield = false;

      // output_item 추가 이벤트 처리
      if (event.type === 'response.output_item.added') {
        const item = event.item;
        if (item.type === 'message') {
          // message 블록 추가
          blocks.push({
            type: 'markdown',
            value: '', refs: []
          });
          shouldYield = true;
        }
      }

      // output_item 완료 이벤트 처리
      if (event.type === 'response.output_item.done') {
        const item = event.item;
        if (item.type === 'message') {
          // message 블록 완료
          const lastBlock = blocks[blocks.length - 1];
          if (lastBlock && lastBlock.type === 'markdown') {
            let text = '';
            let refs: ReferenceCitation[] = [];
            for (const part of item.content) {
              if (part.type === 'output_text') {
                text += part.text;
                for (const ann of part.annotations) {
                  if (ann.type === 'url_citation') {
                    refs.push({
                      startIndex: ann.start_index,
                      endIndex: ann.end_index,
                      label: ann.title,
                      sources: [{
                        type: 'web',
                        url: ann.url,
                        title: ann.title,
                      }],
                    });
                  }
                }
              }
            }
            lastBlock.value = text;
            lastBlock.refs = refs;
            shouldYield = true;
          }
        }
      }

      // delta 이벤트 처리 (텍스트 스트리밍)
      if (event.type === 'response.output_text.delta') {
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === 'markdown') {
          lastBlock.value += event.delta;
          shouldYield = true;
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
    if (signal?.aborted) {
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
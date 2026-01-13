import OpenAI from 'openai';
import type { Message } from "./messages";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // 브라우저에서 사용하기 위해 필요
});

export async function generateMessage(messages: Message[], signal: AbortSignal): Promise<Message> {
  // Message 배열을 OpenAI 메시지 형식으로 변환
  const openaiMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.items
      .map(item => {
        if (item.type === 'text' || item.type === 'markdown') {
          return item.value;
        }
        return '';
      })
      .filter(v => v)
      .join('\n')
  }));

  const completion = await openai.chat.completions.create({
    model: 'gpt-5-mini',
    messages: openaiMessages as any,
  }, { 
    signal: signal 
  });
  const content = completion.choices[0]?.message?.content || '응답을 생성할 수 없습니다.';

  return {
    id: messages.length,
    role: 'assistant',
    items: [
      {
        type: 'markdown',
        value: content
      }
    ],
    voteValue: 'none'
  };
}
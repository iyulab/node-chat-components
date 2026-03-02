import { type JsonSchema } from '../types/JsonSchema.js';

/** LLM에서 action-json 블록으로 출력되는 구조입니다.*/
export interface ActionSchema {
  type: string;
  properties?: Record<string, unknown>;
}

/** Action 정의 구조체 */
export interface ActionDefinition {
  /** action 식별자 (action-json의 "type" 필드와 매칭) */
  type: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  properties?: Record<string, JsonSchema>;
}

/** 프리셋 Action 비트 플래그 */
export enum PresetAction {
  Questions = 1 << 0,
  All       = Questions
}

/** 프리셋 Action 목록 (비트 플래그 순서대로) */
export const PRESET_ACTION_LIST = [
  PresetAction.Questions,
] as const;

/** 프리셋 Action 정의 매핑 */
export const PRESET_ACTION_DEFINITIONS = new Map<PresetAction, ActionDefinition>([
  [
    PresetAction.Questions,
    {
      type: 'question',
      description: 'Present a question to the user with clickable choices',
      properties: {
        question: {
          type: 'string',
          description: 'Optional question text displayed above the choices (e.g. "What would you like to explore?")',
          examples: ['What would you like to do next?'],
        } as any,
        choices: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 5,
          description: 'Clickable choice buttons (1–5 items)',
          examples: [['What are the main differences?', 'Can you show me an example?', 'What should I learn next?']],
        } as any,
      },
    }
  ],
]);
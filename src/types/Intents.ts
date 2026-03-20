import { type JsonSchema } from '../types/JsonSchema.js';

/** LLM에서 intent-json 블록으로 출력되는 구조입니다.*/
export interface IntentSchema {
  type: string;
  properties?: Record<string, unknown>;
}

/** Intent 정의 구조체 */
export interface IntentDefinition {
  /** intent 식별자 (intent-json의 "type" 필드와 매칭) */
  type: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  properties?: Record<string, JsonSchema>;
  /** LLM용 필수 속성 이름 목록 */
  required?: string[];
}

/** 프리셋 Intent 비트 플래그 */
export enum PresetIntent {
  Questions = 1 << 0,
  All       = Questions
}

/** 프리셋 Intent 목록 (비트 플래그 순서대로) */
export const PRESET_INTENT_LIST = [
  PresetIntent.Questions,
] as const;

/** 프리셋 Intent 정의 매핑 */
export const PRESET_INTENT_DEFINITIONS = new Map<PresetIntent, IntentDefinition>([
  [
    PresetIntent.Questions,
    {
      type: 'question',
      description: 'Present a question to the user with clickable choices',
      properties: {
        question: {
          type: 'string',
          description: 'Optional question text displayed above the choices (e.g. "What would you like to explore?")',
        } as any,
        choices: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 5,
          description: 'Clickable choice buttons (1–5 items)'
        } as any,
      },
      required: ['choices'],
    }
  ],
]);

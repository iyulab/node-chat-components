/**
 * 위젯 정의용 JSON Schema 타입
 *
 * 위젯의 속성을 LLM에게 설명하기 위한 최소한의 스키마 정의만 포함.
 * 복잡한 검증 기능이나 메타 정보는 제외하여 단순화함.
 *
 * 제외된 기능들:
 * - $schema, $id 등 메타 정보 (위젯 정의에 불필요)
 * - pattern, format 등 고급 검증 (LLM이 직접 생성하므로 불필요)
 * - allOf, anyOf 등 조합 스키마 (복잡도 증가, 위젯에 과도함)
 * - 조건부 스키마 if/then/else (위젯 속성에 불필요)
 * - 고급 object/array 검증들 (단순한 구조만으로 충분)
 */

export interface BaseJsonSchema {
  /** 속성에 대한 설명 (LLM용) */
  description?: string;
  /** 기본값 */
  default?: any;
  /** 허용 가능한 값들 (제한된 선택지) */
  enum?: any[];
  /** 예시 값들 (LLM이 이해하기 쉽도록) */
  examples?: any[];
}

export interface BooleanJsonSchema extends BaseJsonSchema {
  type: 'boolean';
}

export interface StringJsonSchema extends BaseJsonSchema {
  type: 'string';
  /** 최소 문자열 길이 */
  minLength?: number;
  /** 최대 문자열 길이 */
  maxLength?: number;
}

export interface NumberJsonSchema extends BaseJsonSchema {
  type: 'number' | 'integer';
  /** 최솟값 */
  minimum?: number;
  /** 최댓값 */
  maximum?: number;
}

export interface ArrayJsonSchema extends BaseJsonSchema {
  type: 'array';
  /** 배열 아이템의 스키마 */
  items?: JsonSchema;
  /** 최소 아이템 개수 */
  minItems?: number;
  /** 최대 아이템 개수 */
  maxItems?: number;
}

export interface ObjectJsonSchema extends BaseJsonSchema {
  type: 'object';
  /** 객체의 속성들 */
  properties?: Record<string, JsonSchema>;
  /** 필수 속성 목록 */
  required?: string[];
  /** 정의되지 않은 추가 속성 허용 여부 */
  additionalProperties?: boolean;
}

export type JsonSchema =
  | BooleanJsonSchema
  | StringJsonSchema
  | NumberJsonSchema
  | ArrayJsonSchema
  | ObjectJsonSchema;

/**
 * Element(부가 렌더링 블록)를 정의하는 구조체
 */
export interface ElementSchema {
  /** 등록할 커스텀 엘리먼트 태그명 */
  tag: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  properties?: Record<string, JsonSchema>;
  /** 필수 속성 목록 */
  required?: string[];
}

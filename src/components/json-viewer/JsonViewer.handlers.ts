import { JsonNode } from "./JsonViewer.types";

/** 
 * 이 컨버터는 JsonNode 타입을 사용하여 JSON 데이터를 처리합니다.
 * 문자열 어트리뷰트로 전달된 JSON 문자열을 객체로 변환/직렬화합니다. 
 */
export const jsonConverter = {
  fromAttribute: (value: string | null): JsonNode => {
    if (!value || !value.trim()) return {};
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  },
  toAttribute: (value: JsonNode): string => {
    try {
      return JSON.stringify(value);
    } catch {
      return '{}';
    }
  }
}

export const isValueType = (value: JsonNode): boolean => {
  return value !== Object(value);
}

export const getNodeName = (value: JsonNode): string => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

import type { ElementSchema } from '../types/Schema.js';

/**
 * `block-json` 코드펜스로 만들 수 있는 블록의 허용 목록.
 *
 * `block-json` 은 LLM 출력이다 — 프롬프트 인젝션(검색 문서·첨부·도구 결과)으로 제3자가 쓸 수
 * 있는 입력이라, «등록된 커스텀 엘리먼트면 무엇이든 만든다 + 위험한 속성 이름만 막는다» 는
 * 경계가 되지 못한다. 페이지에는 신뢰된 HTML 을 받는 속성을 가진 엘리먼트가 있고, 거부 목록은
 * 그 이름을 모른다.
 *
 * ⇒ **LLM 에게 알린 스키마가 곧 허용 목록이다.** 태그는 스키마로 등록된 것만, 속성은 그
 * 스키마의 `properties` 에 적힌 이름만 대입한다. 스키마는 이미 LLM 과의 계약이므로 두 번째
 * 목록을 따로 유지할 필요가 없다.
 */
const blocks = new Map<string, ReadonlySet<string>>();

/**
 * 펜스 언어 하나를 블록 하나의 속성 하나에 잇는 등록.
 *
 * 본문 자체가 텍스트 하나인 블록(다이어그램 DSL · 수식 · 코드형 스펙)은 `block-json` 으로 쓰면
 * 그 텍스트를 JSON 문자열 안에 넣어야 해서 줄바꿈 · 따옴표가 모두 이스케이프된다. 등록된 언어의 펜스는
 * 본문을 그대로 그 속성에 대입한다.
 */
export interface FenceBlock {
  /** 펜스 언어(```diagram 의 `diagram`). `block-json` 은 쓸 수 없다. 대소문자는 가리지 않는다. */
  lang: string;
  /** 만들 블록의 태그 — 정의된 커스텀 엘리먼트여야 그려진다. */
  tag: string;
  /** 펜스 본문을 대입할 속성 이름. 이 속성은 그 태그의 허용 목록에 더해진다. */
  property: string;
  /** `text`(기본)는 본문을 문자열 그대로, `json` 은 JSON 으로 파싱한 값을 대입한다. */
  as?: 'text' | 'json';
}

const fences = new Map<string, Readonly<Required<FenceBlock>>>();

/** 블록 태그의 허용 목록 — 스키마의 속성 ∪ 그 태그로 이어진 펜스의 속성. */
function allowedFor(tag: string, schemaProperties: Iterable<string>): ReadonlySet<string> {
  const allowed = new Set(schemaProperties);
  for (const fence of fences.values()) {
    if (fence.tag === tag) allowed.add(fence.property);
  }
  return allowed;
}

/**
 * 블록을 `block-json` 으로 렌더할 수 있게 등록합니다.
 *
 * 내장 블록(chart/images/map/video)은 모듈을 import 하면 스스로 등록되고,
 * `ElementPromptBuilder.add()` 로 추가한 스키마도 함께 등록됩니다.
 * 같은 태그를 다시 등록하면 속성 목록을 새 스키마로 바꿉니다.
 */
export function registerElementBlock(schema: Pick<ElementSchema, 'tag' | 'properties'>): void {
  const tag = schema.tag.trim().toLowerCase();
  blocks.set(tag, allowedFor(tag, Object.keys(schema.properties ?? {})));
}

/**
 * 등록된 블록이면 대입을 허용하는 속성 이름 집합을, 아니면 `undefined` 를 돌려줍니다.
 */
export function getElementBlockProperties(tag: string): ReadonlySet<string> | undefined {
  return blocks.get(tag.trim().toLowerCase());
}

/**
 * 펜스 언어를 블록에 잇습니다. 등록된 언어의 펜스만 `u-marked-block` 이 블록으로 보내고(그 밖의 언어는
 * 종전대로 코드 블록), 대입하는 것은 지정한 속성 하나뿐입니다 — `block-json` 과 같은 허용 목록 의미입니다.
 * 흐름 중에는 스켈레톤, 흐름이 끝난 뒤 블록을 만들지 못하면 펜스 원문을 그 언어의 코드 블록으로 그립니다.
 * 같은 언어를 다시 등록하면 새 등록으로 바꿉니다.
 *
 * @example
 * registerFenceBlock({ lang: 'diagram', tag: 'x-diagram-block', property: 'spec' });
 */
export function registerFenceBlock(fence: FenceBlock): void {
  const lang = fence.lang.trim().toLowerCase();
  if (!lang) throw new Error('registerFenceBlock: lang is required');
  if (lang === 'block-json') throw new Error('registerFenceBlock: "block-json" is reserved for JSON blocks');
  const tag = fence.tag.trim().toLowerCase();
  fences.set(lang, Object.freeze({ lang, tag, property: fence.property, as: fence.as ?? 'text' }));
  blocks.set(tag, allowedFor(tag, blocks.get(tag) ?? []));
}

/** 등록된 펜스 언어면 그 등록을, 아니면 `undefined` 를 돌려줍니다. */
export function getFenceBlock(lang: string): Readonly<Required<FenceBlock>> | undefined {
  return fences.get(lang.trim().toLowerCase());
}

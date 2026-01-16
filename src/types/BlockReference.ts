/**
 * 블록 참조에서 사용되는 참조 내용입니다.
 */
export interface ReferenceSource {
  /** 자료의 종류 입니다. */
  type: 'web' | 'document';
  /** 참조 링크 URL */
  url: string;
  /** 제목 */
  title?: string;
  /** 발췌 내용 */
  snippet?: string;
  /** 태그 */
  tags?: string[];
}

/**
 * 텍스트 컨텐츠 내 인용 참조 블록
 */
export interface TextBlockReference {
  /** 인용 출처 이름 */
  name: string;
  /** 참조 텍스트 시작 위치 (문자 인덱스) */
  startIndex: number;
  /** 참조 텍스트 종료 위치 (문자 인덱스) */
  endIndex: number;
  /** 원본 참조 내용 */
  sources: ReferenceSource[];
}

/**
 * 메시지 컨텐츠 내에서 인용 참조 블록
 */
export type BlockReference = TextBlockReference;

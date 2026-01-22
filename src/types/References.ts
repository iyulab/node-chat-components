/**
 * 참조에서 사용되는 원본 내용입니다.
 */
export interface ReferenceSource {
  /** 자료의 종류 입니다. */
  type: 'web' | 'document';
  /** 참조 링크 URL */
  url?: string;
  /** 제목 */
  title?: string;
  /** 발췌 내용 */
  snippet?: string;
  /** 태그 */
  tags?: string[];
}

/**
 * 본문 내 참조 인용 정보입니다.
 */
export interface ReferenceCitation {
  /** 참조 텍스트 시작 위치 (문자 인덱스) */
  startIndex: number;
  /** 참조 텍스트 종료 위치 (문자 인덱스) */
  endIndex: number;
  /** 본문에 표시될 참조 라벨 (예: [1], (Smith et al., 2023)) */
  label?: string;
  /** 원본 참조 내용 */
  sources: ReferenceSource[];
}

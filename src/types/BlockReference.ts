/**
 * 웹 참조 소스를 나타내는 인터페이스
 */
export interface WebReferenceSource {
  type: 'web';
  /** 웹 페이지의 URL */
  url: string;
  /** 웹 페이지의 제목 */
  title?: string;
  /** 웹 페이지의 발췌 내용 */
  snippet?: string;
  /** 웹 페이지의 파비콘 URL */
  favicon?: string;
}

/**
 * 문서 참조 소스를 나타내는 인터페이스
 */
export interface DocumentReferenceSource {
  type: 'document';
  /** 문서 파일 이름 */
  fileName: string;
  /** 문서 컨텐츠 타입 */
  contentType: string;
  /** 문서 내 섹션 */
  section?: string;
  /** 문서 URL */
  url?: string;
  /** 문서 발췌 내용 */
  snippet?: string;
  /** 관련성 점수 */
  score?: string;
}

/**
 * 블록 참조에서 사용되는 다양한 참조 소스입니다.
 */
export type ReferenceSource = WebReferenceSource | DocumentReferenceSource;

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

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
  /**
   * 출처의 미리보기 이미지 — 인용한 그림·도표 자체, 문서 쪽의 축소판, 웹 문서의 대표 이미지.
   * 카드가 본문 위에 그린다. 모델 출력의 이미지와 같은 출처 정책(`setAllowedImagePrefixes`)을 거치며,
   * 막히면 요청하지 않고 대체 텍스트를 «차단된 이미지» 로 보인다.
   */
  image?: ReferenceImage;
}

/** 출처의 미리보기 이미지 — `u-images-block` 의 항목과 같은 모양이다. */
export interface ReferenceImage {
  /** 이미지 URL */
  src: string;
  /** 대체 텍스트 — 이미지가 근거 자체(도표·그림)면 무엇을 보여 주는지 적는다. 없으면 장식으로 다룬다(카드 제목이 이름을 나른다). */
  alt?: string;
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

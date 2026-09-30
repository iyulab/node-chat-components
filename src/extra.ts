// extras 서브패스: chart/images/map/video 부가 블록을 한 번에 등록합니다.
// 개별 컴포넌트만 필요하다면 `@iyulab/chat-components/dist/components-extra/UChartBlock.js`처럼
// dist 경로로 직접 import하여 사용하세요.
export * from './components-extra/UChartBlock.js';
export * from './components-extra/UImagesBlock.js';
export * from './components-extra/UMapBlock.js';
export * from './components-extra/UVideoBlock.js';

import { ElementPromptBuilder } from './utilities/PromptBuilder.js';
import chartSchema from './components-extra/UChartBlock.schema.js';
import imagesSchema from './components-extra/UImagesBlock.schema.js';
import mapSchema from './components-extra/UMapBlock.schema.js';
import videoSchema from './components-extra/UVideoBlock.schema.js';

/**
 * 내장 extra 블록(chart/images/map/video)이 모두 등록된 LLM 시스템 프롬프트 조각.
 *
 * 공유 인스턴스(`ElementPromptBuilder.instance`)에 등록한다 — 문서가 약속하듯 소비자가 거기에
 * 자기 extra 를 더한 뒤 `build()` 를 다시 부르면 내장 넷과 함께 나온다. 종전에는 별도 인스턴스에
 * 등록해 그 `build()` 가 소비자 것만 돌려줬다.
 */
export const prompt = ElementPromptBuilder.instance
  .add(imagesSchema)
  .add(videoSchema)
  .add(mapSchema)
  .add(chartSchema)
  .build();

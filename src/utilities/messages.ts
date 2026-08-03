import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * `@iyulab/chat-components` 의 화면 문자열 — **영어 기본 + 로케일 레지스트리**.
 *
 * ⚠**지금 한 키뿐이다.** 그래도 리터럴을 영어로 바꾸는 대신 레지스트리를 두는 이유는,
 * 이 리포가 채택한 표준이 *"영어 기본 **+ 레지스트리**"* 이기 때문이다 — 영어 리터럴만으로는
 * 한국어 앱이 그 문구를 되돌릴 방법이 없다. 다음 문자열은 여기로 온다.
 */
export type ChatMessageKey = 'canvasUnavailable';

export const messages = Locale.namespace<ChatMessageKey>('@iyulab/chat-components');

messages.register('en', {
  canvasUnavailable: 'Canvas 2D context is unavailable.',
});

messages.register('ko', {
  canvasUnavailable: 'Canvas 2D context를 가져올 수 없습니다.',
});

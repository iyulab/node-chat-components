import katex, { type KatexOptions } from "katex";
import type { MarkedExtension, TokenizerAndRendererExtension } from "marked";

/**
 * `marked` 에 TeX 수식 렌더를 붙이는 확장.
 *
 * 알고리즘(구분자 규칙과 토크나이저 구성)은 `marked-katex-extension`(MIT, © 2021 @markedjs)에서
 * 왔고, 타입·옵션 표면은 이 패키지의 필요에 맞춰 다시 썼다.
 *
 * ## 두 가지 «모드»가 있고, 서로 다른 축이다
 *
 * - **`displayMode`** — KaTeX 에게 *"큰 조판으로 그려라"* 라고 말하는 것(`$$…$$`).
 * - **블록 배치** — 수식이 문단 «밖»에 서는 것. `$$` 가 **자기 줄에 혼자** 있을 때만 일어난다.
 *
 * ⚠**둘은 함께 가지 않는다**: 한 줄 안의 `$$x$$` 는 `displayMode` 이면서 문단 «안»에 남는다.
 * 두 축을 하나로 합치면 기존 문서의 조판이 바뀐다.
 *
 * ## 구분자 규칙
 *
 * - 인라인 `$…$` / `$$…$$` — 여는 구분자 뒤에 `$` 가 바로 오지 않아야 하고(빈 수식 방지),
 *   내용은 **줄을 넘지 못하며**, 닫는 구분자 뒤에는 공백·구두점·문장 끝이 와야 한다.
 * - 블록 `$$\n…\n$$` — 여는·닫는 `$$` 가 각각 자기 줄에 있을 때.
 *
 * 🔴**«수식이 아닌 것을 수식으로 만들지 않는 것»이 이 규칙의 목적이다.** 가장 흔한 오탐
 * 경로는 통화 표기 둘(`from $5 to $10`)이고, 그것을 막는 것이 ⑴내용에서 개행을 배제하고
 * ⑵닫는 구분자 뒤 문맥을 요구하는 두 조건이다. 규칙을 느슨하게 하면 본문이 통째로 한
 * 수식으로 삼켜진다.
 */

/** 여는 구분자 뒤에 `$` 가 오지 않고, 내용이 줄을 넘지 않으며, 닫는 뒤가 공백·구두점·끝. */
const INLINE_RULE = /^(\${1,2})(?!\$)((?:\\.|[^\\\n])*?(?:\\.|[^\\\n$]))\1(?=[\s?!.,:？！。，：]|$)/;

/** `$$` 가 각각 자기 줄에 있는 형태. */
const BLOCK_RULE = /^(\${1,2})\n((?:\\[^]|[^\\])+?)\n\1(?:\n|$)/;

/** 이 확장이 만드는 토큰 — `marked` 의 `Tokens.Generic` 에 두 필드를 더한 형태. */
interface KatexToken {
  type: "inlineKatex" | "blockKatex";
  raw: string;
  text: string;
  displayMode: boolean;
}

/** `marked` 확장이 받는 옵션 — `displayMode` 는 구분자가 정하므로 소비자가 줄 수 없다. */
export type MarkedKatexOptions = Omit<KatexOptions, "displayMode">;

function render(options: MarkedKatexOptions, token: KatexToken, newlineAfter: boolean): string {
  const html = katex.renderToString(token.text, { ...options, displayMode: token.displayMode });
  return newlineAfter ? `${html}\n` : html;
}

function inlineKatex(options: MarkedKatexOptions): TokenizerAndRendererExtension {
  return {
    name: "inlineKatex",
    level: "inline",
    /**
     * `marked` 가 «인라인 텍스트를 어디서 끊을지» 고르는 힌트.
     *
     * ⚠**이것은 규칙이 아니라 힌트다** — 여기서 걸러도 토크나이저는 그 뒤 위치에서 다시
     * 호출되므로, 여는 `$` 앞에 공백이 없는 `a$x$` 도 결국 파싱된다. 문서의 조판을 바꾸지
     * 않으려면 이 성질을 그대로 두어야 한다.
     */
    start(src: string) {
      let indexSrc = src;
      let consumed = 0;

      while (indexSrc) {
        const index = indexSrc.indexOf("$");
        if (index === -1) return;

        const atBoundary = index === 0 || indexSrc.charAt(index - 1) === " ";
        if (atBoundary && INLINE_RULE.test(indexSrc.substring(index))) {
          return consumed + index;
        }

        const skipped = indexSrc.substring(index + 1);
        const trimmed = skipped.replace(/^\$+/, "");
        consumed += index + 1 + (skipped.length - trimmed.length);
        indexSrc = trimmed;
      }
      return;
    },
    tokenizer(src: string) {
      const match = src.match(INLINE_RULE);
      if (!match) return undefined;
      return {
        type: "inlineKatex",
        raw: match[0],
        text: match[2].trim(),
        displayMode: match[1].length === 2,
      } as unknown as KatexToken;
    },
    renderer(token) {
      return render(options, token as unknown as KatexToken, false);
    },
  };
}

function blockKatex(options: MarkedKatexOptions): TokenizerAndRendererExtension {
  return {
    name: "blockKatex",
    level: "block",
    tokenizer(src: string) {
      const match = src.match(BLOCK_RULE);
      if (!match) return undefined;
      return {
        type: "blockKatex",
        raw: match[0],
        text: match[2].trim(),
        displayMode: match[1].length === 2,
      } as unknown as KatexToken;
    },
    renderer(token) {
      return render(options, token as unknown as KatexToken, true);
    },
  };
}

/**
 * `marked.use()` 에 넘길 수식 확장을 만든다.
 *
 * @param options KaTeX 렌더 옵션(`displayMode` 제외 — 구분자가 정한다).
 */
export function markedKatex(options: MarkedKatexOptions = {}): MarkedExtension {
  return { extensions: [inlineKatex(options), blockKatex(options)] };
}

import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UTableBlock.js';
import type { UTableBlock } from '../../src/components/blocks/UTableBlock.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * `u-table-block` 은 이 패키지에서 **유일하게 로케일 레지스트리 밖에 있던** 컴포넌트였다
 * (`messages` 를 import 조차 하지 않았다 — 자매 컴포넌트 다섯은 전부 쓰고 있었다).
 * 툴바의 문자열 넷(검색 placeholder · 행 수 · Excel/CSV 다운로드 title)이 영어 리터럴이라
 * `Locale.set('ko')` 로 바꿔도 영어로 남았다.
 *
 * ★**행 수 문구는 «보간» 이라 이 마이그레이션의 설계 질문이었다** — 초안은 함수형 등록 같은
 *   새 표면이 필요할 수 있다고 적었지만, 실측하니 `Locale.text(key, params)` 가 이미
 *   `{name}` 치환을 지원한다. ⇒ 새 API 없이 `'{shown} / {total} Rows'` 로 해결된다.
 *   이 테스트가 **그 보간이 실제로 치환되는지**(치환 실패 시 `{shown}` 이 그대로 남는다)를
 *   함께 고정한다.
 *
 * ⚠로케일마다 **새 엘리먼트**를 만든다 — 같은 엘리먼트를 재사용하면 module-singleton
 *   `Locale` 상태 레이스가 생긴다(cycle-393 실측, `title-attribute-locale` 와 같은 이유).
 */
describe('u-table-block 툴바 로케일', () => {
  const seed = (el: UTableBlock) => {
    el.headers = [{ text: 'A' }, { text: 'B' }] as UTableBlock['headers'];
    el.rows = [
      [{ text: '1' }, { text: '2' }],
      [{ text: '3' }, { text: '4' }],
      [{ text: '5' }, { text: '6' }],
    ] as UTableBlock['rows'];
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  it('검색 placeholder · 다운로드 title 넷이 로케일을 따른다', async () => {
    Locale.set('en');
    const en = document.createElement('u-table-block') as UTableBlock;
    seed(en);
    document.body.appendChild(en);
    await en.updateComplete;
    const enRoot = en.shadowRoot!;
    expect(enRoot.querySelector('.toolbar-search')!.getAttribute('placeholder')).toBe('Search...');
    const enBtns = enRoot.querySelectorAll('.toolbar-right u-button');
    expect(enBtns[0].getAttribute('title')).toBe('Excel Download');
    expect(enBtns[1].getAttribute('title')).toBe('CSV Download');
    document.body.removeChild(en);

    Locale.set('ko');
    const ko = document.createElement('u-table-block') as UTableBlock;
    seed(ko);
    document.body.appendChild(ko);
    await ko.updateComplete;
    const koRoot = ko.shadowRoot!;
    expect(koRoot.querySelector('.toolbar-search')!.getAttribute('placeholder')).toBe('검색...');
    const koBtns = koRoot.querySelectorAll('.toolbar-right u-button');
    expect(koBtns[0].getAttribute('title')).toBe('Excel 다운로드');
    expect(koBtns[1].getAttribute('title')).toBe('CSV 다운로드');
  });

  it('행 수 문구가 로케일을 따르고 «보간이 실제로 치환된다»', async () => {
    Locale.set('en');
    const en = document.createElement('u-table-block') as UTableBlock;
    seed(en);
    document.body.appendChild(en);
    await en.updateComplete;
    const enText = en.shadowRoot!.querySelector('.toolbar-count')!.textContent!.trim();
    expect(enText).toBe('3 / 3 Rows');
    // 🔴치환이 실패하면 자리표시자가 그대로 남는다 — 그 상태도 «문자열이 나오므로» 통과처럼
    //    보이기 때문에 따로 고정한다.
    expect(enText).not.toContain('{shown}');
    expect(enText).not.toContain('{total}');
    document.body.removeChild(en);

    Locale.set('ko');
    const ko = document.createElement('u-table-block') as UTableBlock;
    seed(ko);
    document.body.appendChild(ko);
    await ko.updateComplete;
    expect(ko.shadowRoot!.querySelector('.toolbar-count')!.textContent!.trim()).toBe('3 / 3 행');
  });
});

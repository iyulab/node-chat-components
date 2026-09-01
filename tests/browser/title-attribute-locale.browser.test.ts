import { describe, it, expect, beforeEach } from 'vitest';
import '../../src/components/blocks/UFileBlock.js';
import '../../src/components-extra/UChartBlock.js';
import type { UFileBlock } from '../../src/components/blocks/UFileBlock.js';
import type { UChartBlock } from '../../src/components-extra/UChartBlock.js';
import { Locale } from '@iyulab/components/dist/utilities/Locale.js';

/**
 * `u-file-block`의 삭제 버튼과 `u-chart-block`의 다운로드/전체화면 버튼은
 * `aria-label`은 `messages`로 로케일을 태웠지만 `title`(툴팁)은 영어
 * 리터럴로 하드코딩돼 있었다(cycle-393 `UDatePicker` aria-label과 같은
 * 클래스 — 같은 파일 안에서 일부는 로케일 레지스트리, 일부는 리터럴).
 * `Locale.set('ko')`로 전환해도 `title`이 계속 영어로 남지 않는지 확인한다.
 */
describe('chat-components title 속성 로케일 일치', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    Locale.set('en');
  });

  // 별도 it()로 나누거나 같은 엘리먼트에서 Locale.set() 후 재사용하면 module-singleton
  // Locale 상태 레이스·초기 렌더 캡처 문제가 생긴다(cycle-393 실측과 동일 원인) — 로케일마다
  // 새 엘리먼트를 만들어 하나의 it() 안에서 순차 검증한다.
  it('u-file-block의 삭제 버튼 title이 aria-label과 함께 로케일을 따른다', async () => {
    Locale.set('en');
    const en = document.createElement('u-file-block') as UFileBlock;
    en.name = 'photo.png';
    en.removable = true;
    document.body.appendChild(en);
    await en.updateComplete;
    const enBtn = en.shadowRoot!.querySelector('.remove-btn')!;
    expect(enBtn.getAttribute('title')).toBe('Remove');
    expect(enBtn.getAttribute('aria-label')).toBe('Remove');
    document.body.removeChild(en);

    Locale.set('ko');
    const ko = document.createElement('u-file-block') as UFileBlock;
    ko.name = 'photo.png';
    ko.removable = true;
    document.body.appendChild(ko);
    await ko.updateComplete;
    const koBtn = ko.shadowRoot!.querySelector('.remove-btn')!;
    expect(koBtn.getAttribute('title')).toBe('제거');
    expect(koBtn.getAttribute('aria-label')).toBe('제거');
  });

  it('u-chart-block의 다운로드/전체화면 버튼 title이 로케일을 따른다', async () => {
    Locale.set('en');
    const en = document.createElement('u-chart-block') as UChartBlock;
    en.type = 'bar';
    en.data = { labels: ['a'], datasets: [{ data: [1] }] };
    document.body.appendChild(en);
    await en.updateComplete;
    const [enPng, enJson, enFull] = [...en.shadowRoot!.querySelectorAll('.toolbar-right u-button')];
    expect(enPng.getAttribute('title')).toBe('PNG Download');
    expect(enJson.getAttribute('title')).toBe('JSON Download');
    expect(enFull.getAttribute('title')).toBe('Full screen');
    expect(enFull.getAttribute('aria-label')).toBe('Full screen');
    document.body.removeChild(en);

    Locale.set('ko');
    const ko = document.createElement('u-chart-block') as UChartBlock;
    ko.type = 'bar';
    ko.data = { labels: ['a'], datasets: [{ data: [1] }] };
    document.body.appendChild(ko);
    await ko.updateComplete;
    const [koPng, koJson, koFull] = [...ko.shadowRoot!.querySelectorAll('.toolbar-right u-button')];
    expect(koPng.getAttribute('title')).toBe('PNG 다운로드');
    expect(koJson.getAttribute('title')).toBe('JSON 다운로드');
    expect(koFull.getAttribute('title')).toBe('전체 화면');
    expect(koFull.getAttribute('aria-label')).toBe('전체 화면');
  });
});

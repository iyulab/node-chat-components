import { describe, it, expect, afterEach } from 'vitest';
import { URefCard, googleFaviconUrl } from '../../src/components/references/URefCard.js';

// 파비콘은 카드가 스스로 만드는 유일한 외부 요청이었다. 기본값은 요청하지 않는 것이고,
// 소비자가 리졸버를 줄 때만 이미지를 그린다.
async function mount(setup?: (el: URefCard) => void): Promise<URefCard> {
  const el = document.createElement('u-ref-card') as URefCard;
  el.type = 'web';
  el.url = 'https://docs.example.com/page';
  el.title = 'Page';
  setup?.(el);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const favicon = (el: URefCard) => el.shadowRoot!.querySelector<HTMLImageElement>('img.favicon');

describe('u-ref-card favicon source', () => {
  afterEach(() => {
    URefCard.defaultFaviconUrl = undefined;
    document.body.innerHTML = '';
  });

  it('requests no favicon by default', async () => {
    const el = await mount();
    expect(favicon(el)).toBeNull();
  });

  it('uses the module-wide resolver when set', async () => {
    URefCard.defaultFaviconUrl = (url) => `/icons/${new URL(url).hostname}.png`;
    const el = await mount();
    expect(favicon(el)?.getAttribute('src')).toBe('/icons/docs.example.com.png');
  });

  it('prefers the card resolver over the module-wide one', async () => {
    URefCard.defaultFaviconUrl = () => '/module.png';
    const el = await mount((card) => { card.faviconUrl = () => '/card.png'; });
    expect(favicon(el)?.getAttribute('src')).toBe('/card.png');
  });

  it('draws nothing when the resolver returns undefined', async () => {
    URefCard.defaultFaviconUrl = () => undefined;
    const el = await mount();
    expect(favicon(el)).toBeNull();
  });

  it('draws nothing for a card without a url', async () => {
    URefCard.defaultFaviconUrl = () => '/module.png';
    const el = await mount((card) => { card.url = undefined; });
    expect(favicon(el)).toBeNull();
  });

  it('googleFaviconUrl is an explicit opt-in that sends only the host name', () => {
    expect(googleFaviconUrl('https://docs.example.com/a?b=c')).toBe(
      'https://www.google.com/s2/favicons?sz=64&domain=docs.example.com',
    );
    expect(googleFaviconUrl('not a url')).toBeUndefined();
  });
});

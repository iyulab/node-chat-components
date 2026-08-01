// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync, globSync } from 'fs';
import { resolve, join } from 'path';

const root = resolve(__dirname, '..');
const sources = () =>
  globSync('src/**/*.styles.ts', { cwd: root }).map(
    rel => [rel.replace(/\\/g, '/'), readFileSync(join(root, rel), 'utf-8')] as const,
  );

/**
 * 규약: **역할이 있는 색은 역할 토큰으로 읽는다.**
 *
 * 팔레트는 **이름이 곧 값의 약속**이라, 소비자가 브랜드를 맞추려고 덮으면 *진짜 그 색*이
 * 필요한 곳까지 오염된다. 그래서 강조·상태·텍스트·테두리처럼 **역할이 분명한 색**은
 * 역할 토큰을 경유해야 한다.
 *
 * ★그러나 **전부 옮길 수는 없다.** 역할 층의 강도 축은 `-weakest`(음영 200)에서 끝나고
 * 표면 단계(면 elevation)에 해당하는 토큰이 없다. 남은 참조들은 전부 그 부류다:
 *
 * | 남은 것 | 왜 못 옮기나 |
 * |---|---|
 * | `--u-neutral-{0,50,100,200,600}` | **표면 단계**다. 역할 층의 `--u-bg-color-{hover,active,disabled}` 는 *상호작용 상태* 이름이라, 면 높이를 거기 얹으면 의미가 어긋난다 |
 * | `--u-{blue,green,red}-0` | **상태 표면 틴트**다. 강도 축이 음영 200(`-weakest`)에서 끝나 등가물이 없다 |
 *
 * ⇒ 억지로 옮기면 위계가 무너지거나 이름이 거짓말을 한다. 역할 층에 **표면 축**이 생기면
 * 그때 옮긴다 — 그 부재는 이 리포에서 **세 번째로 관측된** 같은 공백이다.
 */
describe('팔레트 직접 참조 — 역할이 있는 색은 남아 있지 않다', () => {
  const PALETTE = /var\((--u-(?:blue|red|green|yellow|purple|orange|neutral)-\d+)/g;

  it('남은 참조는 측정된 예외(표면·틴트)뿐이다', () => {
    const remaining = sources()
      .flatMap(([, src]) => [...src.matchAll(PALETTE)].map(m => m[1]))
      .filter(name => !/^--u-neutral-(0|50|100|200|600)$/.test(name))
      .filter(name => !/^--u-(blue|green|red)-0$/.test(name));
    // 새 팔레트 참조가 들어오면 여기서 걸린다. 예외를 늘리려면 위 표에 이유를 적는다.
    expect([...new Set(remaining)].sort()).toEqual([]);
  });

  it('강조·상태 색이 역할 토큰을 경유한다', () => {
    const all = sources().map(([, s]) => s).join('\n');
    expect(all).toMatch(/var\(--u-txt-color-hover/);      // 링크 강조
    expect(all).toMatch(/var\(--u-info-color-strong/);    // 배지: 웹
    expect(all).toMatch(/var\(--u-success-color-strong/); // 배지: 문서
    expect(all).toMatch(/var\(--u-danger-color/);         // 오류 표시
  });

  it('예외 목록이 실제로 소진되지 않았다 (가드가 공회전하지 않는다)', () => {
    // 예외가 0건이 되면 위 첫 테스트는 아무것도 걸러내지 않으면서 통과한다.
    // 그때는 필터를 지우고 예외 없는 단언으로 바꿔야 한다.
    const exceptions = sources()
      .flatMap(([, src]) => [...src.matchAll(PALETTE)].map(m => m[1]))
      .filter(name => /^--u-(?:neutral-(?:0|50|100|200|600)|(?:blue|green|red)-0)$/.test(name));
    expect(exceptions.length).toBeGreaterThan(0);
  });
});

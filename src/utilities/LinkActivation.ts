import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { LinkActivateEventDetail } from "../events/LinkActivateEvent.js";

/**
 * 렌더된 내용 속 링크의 활성화를 호스트에 묻는다.
 *
 * 이 패키지가 그리는 링크(마크다운 · 인용 · 표 셀 · 지도 캡션)는 대개 모델 출력에서 온다 — 누가 그
 * 링크를 따라갈지 정하는 것은 그것을 품은 앱이다(SPA 라우터 · 데스크톱 셸의 외부 브라우저 · 거부).
 * 사람이 링크를 누르면(왼쪽 클릭 · 가운데 클릭) 호스트에서 취소 가능한 `link-activate` 를 낸다.
 * 앱이 `preventDefault()` 하면 브라우저의 이동도 막힌다. 아무도 막지 않으면 링크의 기본 동작
 * (새 탭 — 렌더러의 기본값)대로다.
 *
 * 블록이 겹쳐 있어도(마크다운 안의 표 · 인용) 한 번의 누름에 이벤트는 하나다 — 가장 안쪽 블록이 낸다.
 *
 * 🔴**듣는 자리는 호스트 요소가 아니라 섀도 루트다.** 요소에 `click` 리스너가 있으면 Chromium 은 그 요소를 «클릭 가능» 으로
 * 접근성 트리에 내놓고, 스크린리더는 블록에 들어설 때마다 그것을 말한다(NVDA 실측: «클릭 가능, 설치 안내 …, 링크»). 섀도
 * 루트는 요소가 아니라 그 표시가 없고, 섀도 안(그리고 슬롯으로 그려진) 링크의 누름은 모두 그곳을 지난다.
 */
const asked = new WeakSet<Event>();

type LinkHost = ReactiveControllerHost & HTMLElement & { readonly renderRoot: HTMLElement | DocumentFragment };

export class LinkActivationController implements ReactiveController {
  constructor(private readonly host: LinkHost) {
    host.addController(this);
  }

  hostConnected(): void {
    this.host.renderRoot.addEventListener("click", this.onActivate as EventListener);
    this.host.renderRoot.addEventListener("auxclick", this.onActivate as EventListener);
  }

  hostDisconnected(): void {
    this.host.renderRoot.removeEventListener("click", this.onActivate as EventListener);
    this.host.renderRoot.removeEventListener("auxclick", this.onActivate as EventListener);
  }

  private readonly onActivate = (e: MouseEvent): void => {
    if (asked.has(e) || e.defaultPrevented) return;
    if (e.type === "auxclick" && e.button !== 1) return;
    // 호스트 «안» 의 링크만 — 호스트를 감싼 페이지의 `<a>` 는 이 블록이 그린 것이 아니다.
    const path = e.composedPath();
    const inside = path.slice(0, path.indexOf(this.host));
    const anchor = inside.find((n): n is HTMLAnchorElement => n instanceof HTMLAnchorElement && n.hasAttribute("href"));
    if (!anchor) return;
    asked.add(e);
    const allowed = this.host.dispatchEvent(new CustomEvent<LinkActivateEventDetail>("link-activate", {
      detail: { href: anchor.href, originalEvent: e },
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
    if (!allowed) e.preventDefault();
  };
}

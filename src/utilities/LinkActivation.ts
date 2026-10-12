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
 */
const asked = new WeakSet<Event>();

export class LinkActivationController implements ReactiveController {
  constructor(private readonly host: ReactiveControllerHost & HTMLElement) {
    host.addController(this);
  }

  hostConnected(): void {
    this.host.addEventListener("click", this.onActivate);
    this.host.addEventListener("auxclick", this.onActivate);
  }

  hostDisconnected(): void {
    this.host.removeEventListener("click", this.onActivate);
    this.host.removeEventListener("auxclick", this.onActivate);
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

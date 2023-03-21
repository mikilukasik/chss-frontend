import { component, html } from "../../../../../litState/lib";
import { Link } from "../../../../../litState/lib/components";

export const HeaderNav = component(
  () =>
    html`<div class="header-nav">
      Header ${Link("nav-link-to-game", { to: "/game", children: "Game" })}
    </div>`
);

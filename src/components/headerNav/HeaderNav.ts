import { component, html } from "../../../litState/src";
import { Link } from "../../../litState/src/components";

export const HeaderNav = component(
  () =>
    html`<div class="header-nav">
      Header ${Link("nav-link-to-game", { to: "/game", children: "Game" })}
    </div>`
);

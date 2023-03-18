import { component, html } from "../../../../../litState/lib";
import { Link } from "../../../../../litState/lib/components";

export const HeaderNav = component(
  () => html`<div>Header ${Link({ to: "/game", children: "Game" })}</div>`
);

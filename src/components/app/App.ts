import { component, html } from "../../../litState/lib";
import { Router } from "../../../litState/lib/components";
import { Game } from "../game/Game";
import { HeaderNav } from "../headerNav/HeaderNav";
import { Home } from "../home/Home";

const routes = {
  "/": Home,
  "/game": Game,
  "*": () => html`<h1>404 Not Found</h1>`,
};

export const App = component(
  () => html`
    <div>${HeaderNav()}</div>
    <div>${Router({ routes })}</div>
  `
);

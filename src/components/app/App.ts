import { component, html, createState, handler } from "../../../litState/lib";
import { Router } from "../../../litState/lib/components";
import { Game } from "../game/Game";
import { HeaderNav } from "../headerNav/HeaderNav";
import { Home } from "../home/Home";
import "./app.scss";

const routes = {
  "/": Game, // Home
  "/game": Game,
  "*": () => html`<h1>404 Not Found</h1>`,
};

const state = createState({
  leftBarClass: "open",
});

const toggleLeftBar = () => {
  state.leftBarClass = state.leftBarClass === "open" ? "closed" : "open";
};

export const App = component(
  () => html`
    <div class="wrapper">
      <div class="header">
        ${HeaderNav()}
        <div class="hamburger" onclick="${handler(() => toggleLeftBar())}">
          &#9776;
        </div>
      </div>
      <div class="left-bar ${state.leftBarClass}">
        <p>Left bar content...</p>
      </div>
      <div class="main">${Router({ routes })}</div>
    </div>
  `
);

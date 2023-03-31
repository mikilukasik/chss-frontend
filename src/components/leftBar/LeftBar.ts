import "./leftBar.scss";

import { component, createState, handler, html } from "../../../litState/src";
import { Button } from "../button/Button";
import { newGame } from "./helpers/newGame";

const state = createState({
  leftBarClass: "closed",
});

document.addEventListener("click", (e) => {
  if (
    e.target &&
    (e.target as HTMLElement).id !== "left-bar" &&
    (e.target as HTMLElement).id !== "hamburger-button"
  )
    state.leftBarClass = "closed";
});

export const toggleLeftBar = () => {
  state.leftBarClass = state.leftBarClass === "open" ? "closed" : "open";
};

export const LeftBar = component(
  () => html`
    <div id="left-bar" class="left-bar ${state.leftBarClass}">
      ${Button({
        buttonProps: { onclick: handler(() => newGame()) },
        children: "New game",
      })}
    </div>
  `
);

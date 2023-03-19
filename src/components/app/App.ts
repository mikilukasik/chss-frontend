import {
  component,
  html,
  createState,
  handler,
} from "../../../../../litState/lib";
import { Router } from "../../../../../litState/lib/components";
import { routes } from "../../helpers/routes";
import { HeaderNav } from "../headerNav/HeaderNav";
import "./app.scss";

const state = createState({
  leftBarClass: "closed",
});

const toggleLeftBar = () => {
  state.leftBarClass = state.leftBarClass === "open" ? "closed" : "open";
};

const LeftBar = component(
  () => html`
    <div id="left-bar" class="left-bar ${state.leftBarClass}">
      <p>Left bar content...</p>
    </div>
  `
);

export const App = component(
  () => html`
    <div class="wrapper">
      <div class="header">
        <div
          id="hamburger"
          class="hamburger"
          onclick="${handler(() => toggleLeftBar())}"
        >
          <img
            class="hamburger-svg"
            src="assets/svg/Hamburger_icon.svg"
            alt="Toggle left menu bar"
          />
        </div>
        ${HeaderNav()}
      </div>
      ${LeftBar()}
      <div class="main">${Router({ routes })}</div>
    </div>
  `
);

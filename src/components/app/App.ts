import {
  component,
  html,
  createState,
  handler,
} from "../../../../../litState/lib";
import { Router } from "../../../../../litState/lib/components";
import { routes } from "../../helpers/routes";
import { HeaderNav } from "../headerNav/HeaderNav";
import { LeftBar, toggleLeftBar } from "../leftBar/LeftBar";
import "./app.scss";

const hamburgerClickHandler = handler(() => toggleLeftBar()).trim();

export const App = component(
  () => html`
    <div class="wrapper">
      <div class="header">
        <div
          id="hamburger"
          class="hamburger"
          onclick="${hamburgerClickHandler}"
        >
          <img
            class="hamburger-svg"
            src="assets/svg/Hamburger_icon.svg"
            alt="Toggle left menu bar"
          />
        </div>
        ${HeaderNav("header-nav")}
      </div>
      ${LeftBar("left-bar")}
      <div class="main">${Router("router", { routes })}</div>
    </div>
  `
);

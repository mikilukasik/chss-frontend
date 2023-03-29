import { component, html } from "../../../litState/src";
import { Router } from "../../../litState/src/components";
import { routes } from "../../helpers/routes";
import { HeaderNav } from "../headerNav/HeaderNav";
import { LeftBar } from "../leftBar/LeftBar";
import { Modal } from "../modal/Modal";
import "./app.scss";

export const App = component(
  () => html`
    <div class="wrapper">
      ${Modal("main-modal")} ${HeaderNav("header-nav")} ${LeftBar("left-bar")}
      <div class="main">${Router("router", { routes })}</div>
    </div>
  `
);

import { component, html } from "../../../litState/src";
import { Router } from "../../../litState/src/components";
import { routes } from "../../helpers/routes";
import { HeaderNav } from "../headerNav/HeaderNav";
import { LeftBar } from "../leftBar/LeftBar";
import { Modal } from "../modal/Modal";
import { StatusMessages } from "../statusMessages/StatusMessages";
import "./app.scss";

export const App = component(
  () => html`
    <div class="wrapper">
      ${Modal()} ${HeaderNav()} ${LeftBar()} ${StatusMessages()}
      <div class="main">${Router({ routes })}</div>
    </div>
  `
);

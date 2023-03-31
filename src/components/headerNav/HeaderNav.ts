import "./headerNav.scss";

import { component, handler, html } from "../../../litState/src";
import { Link } from "../../../litState/src/components";
import { toggleLeftBar } from "../leftBar/LeftBar";
import { CurrentUser } from "../currentUser/CurrentUser";

const hamburgerClickHandler = handler(() => toggleLeftBar()).trim();

export const HeaderNav = component(
  () =>
    html` <div id="hamburger" class="hamburger">
        <img
          id="hamburger-button"
          class="hamburger-svg"
          src="assets/svg/Hamburger_icon.svg"
          alt="Toggle left menu bar"
          onclick="${hamburgerClickHandler}"
        />
      </div>

      <div class="header-nav">${CurrentUser()}</div>`,
  { class: "header" }
);

// <!-- ${Link("nav-link-to-game", { to: "/game", children: "Game" })} -->

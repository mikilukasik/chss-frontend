import "./leftBar.scss";

import { component, createState, html } from "../../../litState/src";

const state = createState({
  leftBarClass: "closed",
});

export const toggleLeftBar = () => {
  state.leftBarClass = state.leftBarClass === "open" ? "closed" : "open";
};

export const LeftBar = component(
  () => html`
    <div id="left-bar" class="left-bar ${state.leftBarClass}">
      <p>Left bar content...</p>
    </div>
  `
);

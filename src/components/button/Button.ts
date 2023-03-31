import "./button.scss";
import { component, html } from "../../../litState/src";

export const Button = component(({ buttonProps = {}, children }) => {
  return html`
    <div class="button-container">
      <button
        ${Object.keys(buttonProps)
          .map((key) => `${key}="${buttonProps[key]}"`)
          .join(" ")}
      >
        ${children}
      </button>
    </div>
  `;
});

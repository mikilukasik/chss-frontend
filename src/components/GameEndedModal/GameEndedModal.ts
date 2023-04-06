import "./gameEndedModal.scss";

import { component, handler, html } from "../../../litState/src";
import { Button } from "../button/Button";

export const GameEndedModal = component(({ resolve, result }) => {
  return html`
    <div>
      ${result === 1
        ? html`<h2 class="result-numbers">1 - 0</h2>`
        : result
        ? html`<h2 class="result-numbers">0 - 1</h2>`
        : html`<h2 class="result-numbers">0 - 0</h2>`}
      ${Button({
        children: "ok",
        buttonProps: { onclick: handler(() => resolve("ok")) },
      })}
    </div>
  `;
});

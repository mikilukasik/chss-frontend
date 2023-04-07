import "./gameEndedModal.scss";

import { component, handler, html } from "../../../litState/src";
import { Button } from "../button/Button";

const renderResult = (result: number) =>
  result === 1
    ? html`<h2 class="result-numbers">1 - 0</h2>
        <div class="winner-text">Light won</div>`
    : result
    ? html`<h2 class="result-numbers">0 - 1</h2>
        <div class="winner-text">Dark won</div>`
    : html`<h2 class="result-numbers">0 - 0</h2>
        <div class="winner-text">Draw</div>`;

export const GameEndedModal = component(({ resolve, result }) => {
  return html`
    <div>
      ${renderResult(result)}
      <div class="modal-cta">
        ${Button({
          children: "Rematch",
          buttonProps: {
            onclick: handler(() => resolve({ action: "rematch" })),
          },
        })}
        ${Button({
          children: "New game",
          buttonProps: {
            onclick: handler(() => resolve({ action: "newGame" })),
          },
        })}
        ${Button({
          children: "Close",
          buttonProps: { onclick: handler(() => resolve(null)) },
        })}
      </div>
    </div>
  `;
});

import "./input.scss";

import { component, handler, html } from "../../../litState/src";

export const Input = component(
  ({ inputId, name, label, placeholder, onchange, className }) => {
    const onchangeHandler = handler((e: Event) => {
      onchange((e.target as HTMLInputElement).value);
    });

    return html`
      <div class="form-group">
        <label for="${inputId}">${label}</label>
        <input
          type="text"
          id="${inputId}"
          name="${name || inputId}"
          placeholder="${placeholder}"
          oninput="${onchangeHandler}"
          class="${className}"
        />
      </div>
    `;
  }
);

import "./input.scss";

import { component, createState, handler, html } from "../../../litState/src";

export const Input = component(
  ({ inputId, name, label, placeholder, onchange, className, value = "" }) => {
    const localState = createState({ value });

    const onchangeHandler = handler((e: Event) => {
      localState.value = (e.target as HTMLInputElement).value;
      onchange(localState.value);
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
          value="${localState.value}"
        />
      </div>
    `;
  }
);

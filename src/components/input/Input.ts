import "./input.scss";

import {
  batchUpdate,
  component,
  createState,
  handler,
  html,
} from "../../../litState/src";
import { ErrorMessage } from "../errorMessage/ErrorMessage";

export const Input = component(
  ({
    inputId,
    name,
    label,
    placeholder,
    onchange,
    value = "",
    error,
    inverted,
  }) => {
    const localState = createState({ value, prevIncomingValue: value });

    if (value !== localState.prevIncomingValue && value !== localState.value) {
      batchUpdate(() => {
        localState.value = value;
        localState.prevIncomingValue = value;
      });
    }

    const onchangeHandler = handler((e: Event) => {
      localState.value = (e.target as HTMLInputElement).value;
      onchange(localState.value);
    });

    return html`
      <div class="form-group${inverted ? " inverted" : ""}">
        <label for="${inputId}">${label}</label>
        <input
          type="text"
          id="${inputId}"
          name="${name || inputId}"
          placeholder="${placeholder}"
          oninput="${onchangeHandler}"
          class="${error ? "field-with-error" : ""}"
          value="${localState.value.replace(/"/g, "&quot;")}"
        />

        ${ErrorMessage({ error })}
      </div>
    `;
  }
);

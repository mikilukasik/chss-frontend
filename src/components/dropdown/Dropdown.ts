import "./dropdown.scss";

import { component, createState, handler, html } from "../../../litState/src";
import { ErrorMessage } from "../errorMessage/ErrorMessage";

export const Dropdown = component(
  ({
    dropdownId = Math.random().toString(),
    name,
    label,
    placeholder,
    onchange,
    value = null,
    error,
    inverted,
    options = [],
  }) => {
    const localState = createState({ value });

    const onchangeHandler = handler((e: Event) => {
      localState.value = (e.target as HTMLInputElement).value;
      onchange(localState.value);
    });

    return html`
      <div class="form-group${inverted ? " inverted" : ""}">
        <label for="${dropdownId}">${label}</label>

        <select
          id="${dropdownId}"
          name="${name || dropdownId}"
          placeholder="${placeholder}"
          oninput="${onchangeHandler}"
          class="${error ? "field-with-error" : ""}"
          value="${localState.value}"
        >
          ${options
            .map((opt: string | { label: string; value: string }) => {
              const { label, value } =
                typeof opt === "string" ? { label: opt, value: opt } : opt;
              return html`<option value="${value}">${label}</option>`;
            })
            .join("")}
        </select>

        ${ErrorMessage({ error })}
      </div>
    `;
  }
);

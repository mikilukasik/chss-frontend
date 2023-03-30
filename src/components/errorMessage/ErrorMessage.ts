import "./errorMessage.scss";

import { component, html } from "../../../litState/src";

export const ErrorMessage = component(
  ({ error }) => html`<div class="error-message">${error?.message ?? ""}</div>`
);

import "./errorMessage.scss";

import { component, html } from "../../../litState/src";

export const ErrorMessage = component(
  ({ message }) => html` <div class="error-message">${message}</div> `
);

import "./statusMessages.scss";
import { component, html } from "../../../litState/src";
import { statusMessagesState } from "./helpers/statusMessagesState";

const StatusMessage = component(
  ({ message }) =>
    html`
      <div class="status-message${message.show ? " show" : ""}">
        ${message.children}
      </div>
    `
);

export const StatusMessages = component(
  () => html`
    <div>
      ${statusMessagesState.messages
        .map((message) => StatusMessage({ id: message.id, message }))
        .join("")}
    </div>
  `,
  {
    class: "status-messages-container",
  }
);

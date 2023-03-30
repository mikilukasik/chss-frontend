import { component, html } from "../../../litState/src";
import { userState } from "./helpers/userState";

export const CurrentUser = component(() => {
  return html` <div>${userState.name}</div> `;
});

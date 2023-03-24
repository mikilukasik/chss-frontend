import { html } from "../../litState/src";
import { Game } from "../components/game/Game";

export const routes = {
  "/": Game,
  "/game": Game,
  "*": () => html`<h1>404 Not Found</h1>`,
};

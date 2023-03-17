import { component, html } from "../../../litState/lib";
import { navigate } from "../../../litState/lib/components";

export const Home = component(() => {
  // TODO: create home component. for now we just navigate to /game
  navigate("/game");

  return html`<div>Home</div>`;
});

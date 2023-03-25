import { component, handler, html } from "../../../litState/src";
import { pieceFilenames } from "../../helpers/maps/pieceMap";

// todo: i really need local states for components
const resolvers = {
  resolver: (arg: any) => {},
};

const pieceClickHandler = handler((e, t) => {
  if (t?.id === "play-with-dark-button") {
    resolvers.resolver({
      computerPlaysDark: false,
      computerPlaysLight: true,
      rotated: true,
    });
  }

  if (t?.id === "play-with-light-button") {
    resolvers.resolver({ computerPlaysLight: false, computerPlaysDark: true });
  }
});

export const NewGameModal = component(({ resolve }) => {
  resolvers.resolver = resolve;

  return html`
    <div>
      <button onclick="${pieceClickHandler}" id="play-with-light-button">
        Play with light
        <br />
        <img
          class="piece-svg"
          src="assets/svg/${pieceFilenames["P"]}"
          alt="Play with light"
        />
      </button>

      <button onclick="${pieceClickHandler}" id="play-with-dark-button">
        Play with dark
        <br />
        <img
          class="piece-svg"
          src="assets/svg/${pieceFilenames["p"]}"
          alt="Play with dark"
        />
      </button>
    </div>
  `;
});

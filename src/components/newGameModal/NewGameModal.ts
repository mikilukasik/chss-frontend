import "./newGameModal.scss";

import { component, createState, handler, html } from "../../../litState/src";
import { pieceFilenames } from "../../helpers/maps/pieceMap";
import { Input } from "../input/Input";
import { userState } from "../currentUser/helpers/userState";
import { defaultStartingState } from "../../helpers/constants/defaultStartingState";

const newGameModalState = createState({
  errors: {} as Record<
    string,
    { message: string; elementsWithError: string[] }
  >,
});

// todo: i really need local states for components
const resolvers = {
  resolver: (arg: any) => {},
};

const pieceClickHandler = handler((e, t) => {
  const username = (
    document.getElementById(
      "username-input-on-new-game-modal"
    ) as HTMLInputElement
  ).value;

  if (!username) {
    newGameModalState.errors = {
      ...newGameModalState.errors,
      missingUserName: {
        message: "Please enter your name",
        elementsWithError: ["username-input"],
      },
    };

    return;
  }

  if (t?.id === "play-with-dark-button") {
    resolvers.resolver({
      gameState: {
        ...defaultStartingState,
        computerPlaysDark: false,
        computerPlaysLight: true,
        rotated: true,
      },
      username,
    });
  }

  if (t?.id === "play-with-light-button") {
    resolvers.resolver({
      gameState: {
        ...defaultStartingState,
        computerPlaysDark: true,
        computerPlaysLight: false,
        rotated: false,
      },
      username,
    });
  }
});

export const NewGameModal = component(({ resolve }) => {
  resolvers.resolver = resolve;

  return html`
    ${Input({
      inputId: "username-input-on-new-game-modal",
      label: "Player name",
      placeholder: "Enter your name",
      name: "username",
      value: userState.name,
      error: Object.values(newGameModalState.errors).find(
        ({ elementsWithError }) =>
          elementsWithError.find((e) => e === "username-input")
      ),
      onchange: (value: string) => {
        if (value) newGameModalState.errors = {};
      },
    })}

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

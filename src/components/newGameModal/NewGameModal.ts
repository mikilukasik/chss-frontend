import "./newGameModal.scss";

import { component, createState, handler, html } from "../../../litState/src";
import { pieceFilenames } from "../../helpers/maps/pieceMap";
import { ErrorMessage } from "../errorMessage/ErrorMessage";
import { Input } from "../input/Input";

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
        computerPlaysLight: false,
        computerPlaysDark: true,
        rotated: false,
      },
      username,
    });
  }
});

export const NewGameModal = component(({ resolve }) => {
  resolvers.resolver = resolve;

  const errors = Object.values(newGameModalState.errors)
    .map((e) =>
      ErrorMessage(`newgame-modal-error-msg${e.message}`, {
        message: e.message,
      })
    )
    .join("");

  return html`
    ${Input("username-input", {
      inputId: "username-input-on-new-game-modal",
      label: "Player name",
      placeholder: "Enter your name",
      name: "username",
      className: Object.values(newGameModalState.errors).find(
        ({ elementsWithError }) =>
          elementsWithError.find((e) => e === "username-input")
      )
        ? "field-with-error"
        : "",
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

    ${errors && html`<div class="form-errors">${errors}</div>`}
  `;
});

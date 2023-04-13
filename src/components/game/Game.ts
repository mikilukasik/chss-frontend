import { component, handler, html } from "../../../litState/src";
import { Chessboard } from "../chessboard/Chessboard";
import { chessboardState } from "../chessboard/helpers/chessboardState";
import { Input } from "../input/Input";
import "./game.scss";

const rotateBoardHandler = handler(
  () => (chessboardState.rotated = !chessboardState.rotated)
);

export const Game = component(
  () => html`
    <div class="game-wrapper">
      <div class="chessboard-wrapper">${Chessboard()}</div>
      <div class="right-panel">
        <button onclick="${rotateBoardHandler}">rotate</button>
        <div class="engine-config-input-container">
          ${Input({
            inputId: "engine-config-input",
            label: "Engine config",
            value: JSON.stringify(chessboardState.engineConfig),
            onchange: (val: string) =>
              (chessboardState.engineConfig = JSON.parse(val)),
            inverted: true,
          })}
        </div>
      </div>
    </div>
  `
);

import { batchUpdate, component, handler, html } from "../../../litState/src";
import {
  engineProfileNames,
  engineProfiles,
} from "../../helpers/constants/engineProfiles";
import { Accordion } from "../accordion/Accordion";
import { Button } from "../button/Button";
import { Chessboard } from "../chessboard/Chessboard";
import { chessboardState } from "../chessboard/helpers/chessboardState";
import { Dropdown } from "../dropdown/Dropdown";
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
        <div class="right-panel-button-container">
          ${Button({
            buttonProps: { onclick: rotateBoardHandler },
            children: "rotate",
          })}
        </div>

        <div class="right-panel-input-container">
          ${Accordion({
            items: [
              {
                header: "ENGINE CONFIG",
                content: html`
                  ${Dropdown({
                    label: "Engine profile",
                    onchange: (newEngineProfile: string) => {
                      batchUpdate(() => {
                        chessboardState.engineProfile = newEngineProfile;
                        chessboardState.engineConfig =
                          engineProfiles[newEngineProfile];
                      });
                    },
                    options: engineProfileNames,
                    value: chessboardState.engineProfile,
                    inverted: true,
                  })}
                  ${Input({
                    inputId: "right-panel-input",
                    label: "Engine config",
                    value: JSON.stringify(chessboardState.engineConfig),
                    onchange: (val: string) =>
                      (chessboardState.engineConfig = JSON.parse(val)),
                    inverted: true,
                  })}
                `,
              },
            ],
          })}
        </div>
      </div>
    </div>
  `
);

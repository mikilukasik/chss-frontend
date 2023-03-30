import { batchUpdate } from "../../litState/src";
import { chessboardState } from "../components/chessboard/helpers/chessboardState";
import { userState } from "../components/currentUser/helpers/userState";
import { renderModal } from "../components/modal/Modal";
import { NewGameModal } from "../components/newGameModal/NewGameModal";

export const initApp = () => {
  setTimeout(async () => {
    const { gameState, username } = await renderModal(
      (resolve) => NewGameModal("new-game-modal", { resolve }),
      { allowClose: false }
    );

    batchUpdate(() => {
      Object.assign(chessboardState, gameState);
      Object.assign(userState, { name: username });
    });
  }, 0);
};

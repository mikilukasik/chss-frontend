import { chessboardState } from "../components/chessboard/helpers/chessboardState";
import { renderModal } from "../components/modal/Modal";
import { NewGameModal } from "../components/newGameModal/NewGameModal";

export const initApp = () => {
  setTimeout(async () => {
    const addToGameState = await renderModal(
      (resolve) => NewGameModal("new-game-modal", { resolve }),
      { allowClose: false }
    );

    Object.assign(chessboardState, addToGameState);
  }, 0);
};

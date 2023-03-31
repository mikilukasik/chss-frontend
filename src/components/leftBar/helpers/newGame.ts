import { batchUpdate } from "../../../../litState/src";
import { chessboardState } from "../../chessboard/helpers/chessboardState";
import { userState } from "../../currentUser/helpers/userState";
import { renderModal } from "../../modal/Modal";
import { NewGameModal } from "../../newGameModal/NewGameModal";

export const newGame = async () => {
  const { gameState, username } = await renderModal(
    (resolve) => NewGameModal({ resolve }),
    { allowClose: false }
  );

  batchUpdate(() => {
    Object.assign(chessboardState, gameState);
    Object.assign(userState, { name: username });
  });
};

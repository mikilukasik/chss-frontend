import { batchUpdate } from "../../../../litState/src";
import { createGame } from "../../../helpers/gameHelpers/createGame";
import { findOrCreateUser } from "../../../helpers/userHelpers/findOrCreateUser";
import { chessboardState } from "../../chessboard/helpers/chessboardState";
import { userState } from "../../currentUser/helpers/userState";
import { renderModal } from "../../modal/Modal";
import { NewGameModal } from "../../newGameModal/NewGameModal";

export const newGame = async ({ allowClose = false } = {}) => {
  const newGameParams = await renderModal(
    (resolve) => NewGameModal({ resolve }),
    { allowClose }
  );

  if (allowClose && !newGameParams) return;

  const { gameStateUpdate, username } = newGameParams;

  const user = await findOrCreateUser({ name: username });
  batchUpdate(() => Object.assign(userState, user));

  const newGame = await createGame({ user, ...newGameParams });

  batchUpdate(() => {
    Object.assign(chessboardState, gameStateUpdate, {
      gameId: newGame.id,
      moveIndex: 0,
    });
  });
};

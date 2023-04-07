import { batchUpdate } from "../../../litState/src";
import { createGame } from "./createGame";
import { findOrCreateUser } from "../userHelpers/findOrCreateUser";
import { chessboardState } from "../../components/chessboard/helpers/chessboardState";
import { userState } from "../../components/currentUser/helpers/userState";
import { renderModal } from "../../components/modal/Modal";
import { NewGameModal } from "../../components/newGameModal/NewGameModal";
import { defaultStartingState } from "../constants/defaultStartingState";

export const newGame = async ({
  allowClose = false,
  params,
}: { allowClose?: boolean; params?: typeof defaultStartingState } = {}) => {
  const newGameParams = params
    ? { gameStateUpdate: params, username: userState.name }
    : await renderModal((resolve) => NewGameModal({ resolve }), { allowClose });

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

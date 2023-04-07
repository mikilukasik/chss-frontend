import { GameEndedModal } from "../../components/GameEndedModal/GameEndedModal";
import { newGame } from "./newGame";
import { renderModal } from "../../components/modal/Modal";
import { defaultStartingState } from "../constants/defaultStartingState";
import { chessboardState } from "../../components/chessboard/helpers/chessboardState";

export const processCompletedGame = async ({ result }: { result: number }) => {
  const userResponse = await renderModal((resolve) =>
    GameEndedModal({ resolve, result })
  );

  if (!userResponse) return;

  const { action } = userResponse;

  if (action === "newGame") {
    newGame({ allowClose: true });
    return;
  }

  if (action === "rematch") {
    const computerPlaysLight = chessboardState.computerPlaysDark;

    const params = {
      ...defaultStartingState,
      computerPlaysLight,
      computerPlaysDark: !computerPlaysLight,
      rotated: computerPlaysLight,
    };

    newGame({ params });
  }
};

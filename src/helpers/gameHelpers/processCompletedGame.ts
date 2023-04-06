import { GameEndedModal } from "../../components/GameEndedModal/GameEndedModal";
import { renderModal } from "../../components/modal/Modal";

export const processCompletedGame = async ({ result }: { result: number }) => {
  const userResponse = await renderModal((resolve) =>
    GameEndedModal({ resolve, result })
  );
  console.log({ userResponse });
};

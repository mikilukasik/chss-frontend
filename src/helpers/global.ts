import { chessboardState } from "../components/chessboard/helpers/chessboardState";

export const CHSS = {
  handlers: {} as { [key: string]: any },
  setFen: (fen: string) => (chessboardState.fen = fen),
};

Object.assign(window, { CHSS });

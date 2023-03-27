import { component, handler, html } from "../../../litState/src";
import { pieceFilenames, pieceNames } from "../../helpers/maps/pieceMap";

// todo: i really need local states for components
const resolvers = {
  resolver: (arg: any) => {},
};

const pieceClickHandler = handler((e, t) => {
  if (!t?.id?.startsWith("promote-to-")) return;

  const chosenChar = t?.id?.replace("promote-to-", "");
  resolvers.resolver(chosenChar);
});

export const PromotionSelectorModal = component(({ resolve, pieces }) => {
  resolvers.resolver = resolve;

  return html`
    <div>
      ${pieces
        .map(
          (pieceChar: string) => html`
            <button onclick="${pieceClickHandler}" id="promote-to-${pieceChar}">
              <img
                class="piece-svg"
                src="assets/svg/${pieceFilenames[pieceChar]}"
                alt="Promote pawn to ${pieceNames[pieceChar]}"
              />
            </button>
          `
        )
        .join("")}
    </div>
  `;
});

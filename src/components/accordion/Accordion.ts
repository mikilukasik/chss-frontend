import "./accordion.scss";
import { component, createState, html, handler } from "../../../litState/src";

interface Item {
  header: string;
  content: string;
}

export const Accordion = component(({ items = [] as Item[] }) => {
  const localState = createState({
    openedItems: {} as Record<number, boolean>,
  });

  const toggleItem = (index: number) => {
    localState.openedItems[index] = !localState.openedItems[index];
  };

  return html`
    <div class="accordion">
      ${items.map(
        (item: Item, index: number) => html`
          <div class="accordion-item">
            <button
              class="accordion-header"
              onclick="${handler(() => toggleItem(index))}"
            >
              ${item.header}
              <span
                class="chevron${localState.openedItems[index]
                  ? " rotated"
                  : ""}"
              ></span>
            </button>
            <div
              class="accordion-content${localState.openedItems[index]
                ? " active"
                : ""}"
            >
              ${item.content}
            </div>
          </div>
        `
      )}
    </div>
  `;
});

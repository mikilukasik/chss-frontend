import "./accordion.scss";
import { component, createState, html, handler } from "../../../litState/src";

interface Item {
  header: string;
  content: string;
}

export const Accordion = component(({ items = [] as Item[], id }) => {
  const localState = createState({
    openedItems: {} as Record<number, boolean>,
  });

  setTimeout(() => {
    items.forEach((_: Item, index: number) => {
      if (!localState.openedItems[index]) return;

      const content = document.getElementById(
        `accordion-${id}-content-${index}`
      );
      if (
        !content ||
        content.style.maxHeight === content.scrollHeight.toString()
      )
        return;

      content.style.maxHeight = content.scrollHeight + "px";
    });
  }, 0);

  const toggleItem = (index: number) => {
    localState.openedItems[index] = !localState.openedItems[index];
    const content = document.getElementById(`accordion-${id}-content-${index}`);
    if (!content) return;

    content.style.maxHeight = localState.openedItems[index]
      ? content.scrollHeight + "px"
      : "0";
  };

  return html`
    <div class="accordion">
      ${items
        .map(
          (item: Item, index: number) => html`
            <div class="accordion-item">
              <button
                class="accordion-header${localState.openedItems[index]
                  ? " active"
                  : ""}"
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
                id="accordion-${id}-content-${index}"
                class="accordion-content${localState.openedItems[index]
                  ? " active"
                  : ""}"
              >
                ${item.content}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
});

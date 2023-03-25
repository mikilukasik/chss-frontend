import "./modal.scss";

import { component, createState, handler, html } from "../../../litState/src";

const modalState = createState({
  open: false,
});

const closeModal = handler((e, t) => {
  e.preventDefault();
  console.log(e, t, t.id);
  if (t.id === "modal-container" || t.id === "modal-close-button")
    modalState.open = false;
});

export const Modal = component(
  () => html`
    <div
      class="modal-container${modalState.open ? " open" : ""}"
      onclick="${closeModal}"
      id="modal-container"
    >
      <div
        class="modal-content"
        id="modal-content"
        onclick="event.stopPropagation()"
      >
        <span class="close" onclick="${closeModal}" id="modal-close-button"
          >&times;</span
        >
        <p>This is a simple modal.</p>
        <p>Click the close button or outside the modal to close it.</p>
      </div>
    </div>
  `
);

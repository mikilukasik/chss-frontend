import { addListener, createState } from "../../../../litState/src";

const lastActiveUser = localStorage.getItem("activeUser");

export const userState = createState(
  lastActiveUser
    ? JSON.parse(lastActiveUser)
    : {
        id: null as string | null,
        name: "" as string,
      }
);

addListener(async () => {
  localStorage.setItem("activeUser", JSON.stringify(userState));
}, "user-to-localstorage");

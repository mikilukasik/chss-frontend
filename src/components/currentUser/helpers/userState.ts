import { addListener, createState } from "../../../../litState/src";
import { localDb } from "../../../helpers/localDb/indexedDb";
import { getUUID } from "../../../helpers/utils/getUUID";

const lastActiveUser = localStorage.getItem("activeUser");

export const userState = createState(
  lastActiveUser
    ? JSON.parse(lastActiveUser)
    : {
        id: null as string | null,
        name: "" as string,
      }
);

let previousUserName = "";

addListener(async () => {
  if (userState.name !== previousUserName) {
    previousUserName = userState.name;

    const userInLocalDb = (
      await localDb.users.findAll({ name: userState.name })
    )[0];

    if (userInLocalDb) {
      userState.id = userInLocalDb.id;
      localStorage.setItem("activeUser", JSON.stringify(userState));

      return;
    }

    const userId = getUUID();

    await localDb.users.insert({ name: userState.name, id: userId });

    userState.id = userId;
    localStorage.setItem("activeUser", JSON.stringify(userState));
  }
}, "username-change-listener");

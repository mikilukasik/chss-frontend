import { html } from "../../litState/src";
import {
  addStatusMessage,
  removeStatusMessage,
} from "../components/statusMessages/helpers/statusMessagesState";
import { catchErrors } from "./utils/catchErrors";

const errorLogger = (e: any) => {
  addStatusMessage({
    ttl: 3000,
    children: html`<div class="status-message-error">${e.message}</div>`,
  });
};

const logger = ({ level, args }: any) => {
  addStatusMessage({
    ttl: 3000,
    children: html`<div class="status-message-${level}">
      ${JSON.stringify({ args })}
    </div>`,
  });
};

export const initApp = () => {
  catchErrors({
    logger: errorLogger,
  });

  window.CHSS.mainWorker.on("dealWithError", errorLogger);
  window.CHSS.mainWorker.on("log", logger);
  window.CHSS.mainWorker.on("addStatusMessage", addStatusMessage);
  window.CHSS.mainWorker.on("removeStatusMessage", removeStatusMessage);
};

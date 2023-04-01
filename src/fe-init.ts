import { mount } from "../litState/src";
import { App } from "./components/app/App";
import { initApp } from "./helpers/initApp";
import { Config } from "./helpers/types";

export const config = {} as Config;

export const init = ({ config: envConfig }: { config: Config }) => {
  Object.assign(config, envConfig);

  const container = document.getElementById("app-container");
  if (container) {
    mount(App(), container);
    initApp();
  } else {
    throw new Error("App container not found.");
  }
};

import { mount } from "../litState/src";
import { App } from "./components/app/App";
import { initApp } from "./helpers/initApp";

import "./main.scss";

const container = document.getElementById("app-container");
if (container) {
  mount(App("app-root"), container);
  initApp();
} else {
  throw new Error("App container not found.");
}

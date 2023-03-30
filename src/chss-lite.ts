import { mount } from "../litState/src";
import { App } from "./components/app/App";
import { initApp } from "./helpers/initApp";

const container = document.getElementById("app-container");
if (container) {
  mount(App(), container);
  initApp();
} else {
  throw new Error("App container not found.");
}

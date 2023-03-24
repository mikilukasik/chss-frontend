import { mount } from "../litState/src";
import { App } from "./components/app/App";

import "./main.scss";

const container = document.getElementById("app-container");
if (container) mount(App("app-root"), container);

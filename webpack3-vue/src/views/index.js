import Vue from "vue";
import { Button } from "element-ui";
import entryVue from "../utils/entryVue";
import { router } from "./router";
import App from "./app";
Vue.use(Button, { size: "mini" });
entryVue(App, { router });
import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "vant/lib/index.css";
import "@/style/index.less";
import store from "@/store";
import vantComp from "@/plugin/vantComp";

const app = createApp(App);
app.use(store);
app.use(vantComp);

app.use(router).mount("#app");

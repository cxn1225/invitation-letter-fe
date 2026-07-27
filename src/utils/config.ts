import { getApiUrl } from "./common";
const loginBaseUrl = getApiUrl(import.meta.env.VITE_LOGIN_URL);
const baseUrl = getApiUrl(import.meta.env.VITE_BASE_URL);
const busiType = import.meta.env.VITE_APP_LOGIN_BUSITYPE;
const whiteRoutes = ["/login", "/404"]; // 路由白名单

export { loginBaseUrl, baseUrl, busiType, whiteRoutes };

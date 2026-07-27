import { defineStore } from "pinia";
import type { LoginCallbackParamsType, LoginCallbackResType } from "@/api/model/loginModel";
import { loginCallbackApi, logoutApi } from "@/api/login";
import router from "@/router/index";

interface UserStateType {
  accessToken: string; // token
  userInfo: LoginCallbackResType | null; // 根据各自接口定义
}

export const useUserStore = defineStore({
  id: "user",
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user",
        storage: localStorage,
      },
    ],
  },
  state: (): UserStateType => {
    return {
      accessToken: "",
      userInfo: null,
    };
  },
  actions: {
    setToken(payload: string) {
      this.accessToken = payload;
    },
    getUserInfo(payload: LoginCallbackParamsType) {
      return new Promise(async (resove, reject) => {
        try {
          const { headers, data: res } = await loginCallbackApi(payload);
          if (res.code === 0) {
            this.setToken(headers.hxe_auth || "");
            this.userInfo = res.data;
          }
          resove(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    async logout() {
      const { code } = await logoutApi();
      if (code === 0) {
        router.push("/login");
        this.$reset();
      }
    },
  },
});

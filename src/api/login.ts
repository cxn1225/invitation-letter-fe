import { http } from "@/utils/http";
import {
  SendMsgParamsType,
  SendMsgResType,
  LoginParamsType,
  LoginResType,
  LoginCallbackParamsType,
  LoginCallbackResType,
  BusiDetailListResType,
  GetcaptchaofloginParamsType,
} from "./model/loginModel";
import { loginBaseUrl, baseUrl, busiType } from "@/utils/config";
import type { anyObject } from "@/utils/types";

export function sendMsgApi(data: SendMsgParamsType, headers: anyObject = {}) {
  const url = `${loginBaseUrl}/sms/smscode2`;
  return http.request<SendMsgResType>({
    url,
    method: "post",
    params: data,
    headers,
  });
}

export function getcaptchaofloginApi(params: GetcaptchaofloginParamsType) {
  const url = `${loginBaseUrl}/auth/getcaptchaoflogin`;
  return http.request({
    url,
    method: "get",
    params,
    responseType: "blob",
    needHeaders: true,
  });
}

export function loginApi(data: LoginParamsType, headers: anyObject) {
  const url = `${loginBaseUrl}/webapp-msg-login`;
  return http.request<LoginResType>({
    url,
    method: "post",
    data,
    headers,
  });
}

// 获取业务类型详情
export function getBusiDetailListApi() {
  const url = `${loginBaseUrl}/busi-parameter/busi-detail-list`;
  return http.request<BusiDetailListResType>({
    url,
    method: "get",
    params: {
      busiType,
    },
  });
}

export function loginCallbackApi(params: LoginCallbackParamsType) {
  const url = `${baseUrl}/login-callback`;
  return http.request<LoginCallbackResType>({
    url,
    method: "get",
    params,
    needHeaders: true,
  });
}

// 退出登录
export function logoutApi() {
  const url = `${baseUrl}/logout`;
  return http.request({ url, method: "get" });
}

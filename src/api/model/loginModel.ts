//sendMsg接口入参
export interface SendMsgParamsType {
  appKey: string; // appkey
  phone: string; // 手机号
  text?: string; // 图形验证码
}
//sendMsg接口返回值
export interface SendMsgResType {
  msg: any;
  success: boolean;
  token: string; // 短信验证码token
}

export interface GetcaptchaofloginParamsType {
  appKey: string; // 应用key
}

export interface LoginParamsType {
  appKey: string;
  areaCode: string;
  code: string;
  phone: string;
  platform: string;
  rememberMe: number;
  timestamp: number;
  responseType: string;
  state: string;
}

export interface LoginResType {
  code: string; // 用来置换token
  rememberMe: number;
  state: string;
}

export interface LoginCallbackParamsType {
  code: string;
  rememberMe: number;
  state: number;
}

export interface LoginCallbackResType {
  avatar: any;
  platformInfo: any[];
  unionId: string;
  userId: number;
  userName: string;
}

export type BusiDetailListResType = BusiDetailListItemType[];
export interface BusiDetailListItemType {
  idBusi: number;
  noBusi: string;
  nameCn: string;
}

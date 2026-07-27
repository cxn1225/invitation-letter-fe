import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ApiDataResponse } from "#/axios";
import Axios from "axios";
import { showToast } from "vant";
import { whiteCodes } from "./codes";
interface AxiosRequestConfigCustom extends AxiosRequestConfig {
  needHeaders?: boolean; // 响应是否需要头部信息
}

Axios.defaults.withCredentials = true;

const defaultConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: 1000 * 30,
};
class Request {
  private axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = Axios.create(defaultConfig);
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  /**
   * @description 请求拦截器
   */
  private httpInterceptorsRequest(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 添加逻辑
        return config;
      },
      (error: AxiosError): Promise<any> => {
        return Promise.reject(error);
      },
    );
  }
  /**
   * @description 响应拦截器
   */
  private httpInterceptorsResponse(): void {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.headers.hxe_auth) {
          response.data.data && (response.data.data.userToken = response.headers.hxe_auth);
        }
        this.responseHandle(response);
        return response;
      },
      (error: AxiosError): Promise<any> => {
        const { response, message, name } = error;
        // 过滤不需要提示的错误, 比如取消请求
        if (!["CanceledError"].includes(name)) {
          if (response) {
            this.responseHandle(response, message);
          } else {
            const message = error.message.includes("timeout")
              ? "请求超时！请检查网络是否正常"
              : "请求失败，请检查网络是否已连接";
            showToast(message);
          }
        }
        return Promise.reject(error);
      },
    );
  }
  request<T = any, U = any>(config: AxiosRequestConfigCustom): Promise<ApiDataResponse<T> | U> {
    return new Promise((resolve, reject) => {
      this.axiosInstance(config)
        .then((res: AxiosResponse) => {
          resolve(config.needHeaders ? res : res.data);
        })
        .catch((err: Error | AxiosError) => {
          reject(err);
        });
    });
  }

  /**
   * @description 错误码处理
   * @param { Object } response 响应结果
   */
  private responseHandle(response: AxiosResponse, message?: string): void {
    switch (response.status) {
      case 401:
      case 403:
        console.log("需要登录");
        break;
      case 404:
        showToast("请求资源不存在");
        break;
      case 200:
        if (response.config.responseType === "blob") {
          return;
        }
        const code = response.data?.code;
        if (code !== 0 && !Object.keys(whiteCodes).includes(String(code))) {
          showToast(response.data?.message ?? response.data?.msg ?? "出错了");
        }
        break;
      default:
        showToast(response.data?.message ?? message ?? "未知错误");
        break;
    }
  }
}

export const http = new Request();

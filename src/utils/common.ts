import { NumorString, AnyFunction, TimeoutHandle } from "./types";
/**
 * @description 手机号校验
 */
export const isPhone = function (phone: string): boolean {
  const pattern = /^1[3456789]\d{9}$/;
  return pattern.test(phone);
};

/**
 * @description 数字限制
 */
export const onlyNumber = function (phone: string): boolean {
  const pattern = /^\d*$/;
  return pattern.test(phone);
};

/**
 * @description 数字限制
 */
export const requireOnlyNumber = function (phone: string): boolean {
  const pattern = /^\d+$/;
  return pattern.test(phone);
};

/**
 * @description 数字千分位
 * @param num 数字
 * @return 千分位数字
 */
export const numDeal = function (num: NumorString): NumorString {
  if (!num) return num == 0 ? 0 : "";
  const reg = /\d{1,3}(?=(\d{3})+$)/g;
  const numArr = num.toString().split(".");
  const point = numArr[1] ? "." + numArr[1] : "";
  return numArr[0].replace(reg, "$&,") + point;
};

/**
 * @description 价格转换 分-→元
 */
export const priceTransform = function (price: any): NumorString {
  const priceTemp = isNaN(Number(price)) ? 0 : Number(price);
  const rmb = priceTemp / 100;
  return Number.isInteger(rmb) ? rmb : rmb.toFixed(2);
};

/**
 * @description vue模板价格展示
 */
export const priceShow = function (num: NumorString): NumorString {
  return numDeal(priceTransform(num));
};

/**
 * @description 复制函数
 * @param id dom的id
 * @param cb 复制成功后的回调
 */
export const copyHandler = function (id: string, cb: any): void {
  try {
    const dom = document.querySelector(`#${id}`);
    if (!dom) {
      return;
    }
    (dom as any).select();
    document.execCommand("Copy");
    cb && cb();
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description 防抖函数
 * @param fn 最后执行的函数
 * @param wait 多少秒执行
 * @param immediate 是否立即执行
 * @return 返回闭包函数
 */
export const debounce = function (fn: AnyFunction, wait: number, immediate: boolean) {
  let timer: TimeoutHandle;
  let imFlag = immediate ? true : false;
  return function (...args: any[]) {
    clearTimeout(timer);
    if (imFlag) {
      if (fn) {
        // @ts-ignore
        fn.apply(this, args);
      }
      imFlag = false;
    } else {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, args);
      }, wait);
    }
  };
};

// 获取动态url
export const getImageUrl = function (name: string, suffix = "png") {
  return new URL(`../assets/${name}.${suffix}`, import.meta.url).href;
};

/**
 * @description 获取api接口域名
 * @param url 接口地址环境变量
 */
export const getApiUrl = function (url: string): string {
  const protocol = location.protocol;
  return url.replace(/^https?:/, protocol);
};

/**
 * @description bfs遍历tree，获取node
 */
export const getTreeNode = function (tree: any[], handleFunc: AnyFunction) {
  let node;
  const treeTemp = [...tree];
  while ((node = treeTemp.shift())) {
    const breakFlag = handleFunc(node); // 结束标识
    if (breakFlag) {
      return false;
    }
    node.children && treeTemp.unshift(...node.children);
  }
};

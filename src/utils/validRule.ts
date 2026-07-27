import { isPhone, requireOnlyNumber } from "./common";

const validatorMap: Record<string, any> = {
  phone: isPhone,
  requireOnlyNumber,
};

/**
 * @description element-form校验函数
 * @param type 需要那些校验规则
 * @return 返回校验列表
 */
export const validRule = function (
  type: string | Record<string, string>,
  ...args: string[]
): any[] {
  const validList: any[] = [];
  let types: Record<string, string>;
  let msg = "不能为空",
    trigger = "onBlur";
  if (typeof type === "string") {
    args[0] && (msg = args[0]);
    args[1] && (trigger = args[1]);
    if (typeof msg !== "string" || typeof trigger !== "string") {
      console.log(new Error("参数有误，请检查参数是否为string类型"));
      return [];
    }
    types = { [type]: msg };
  } else if (Object.prototype.toString.call(type) === "[object Object]") {
    types = type;
    args[0] && (trigger = args[0]);
  } else {
    console.log(new Error("参数有误"));
    return [];
  }
  Object.keys(types).forEach((name) => {
    const msgContent = types[name];
    if (name === "required") {
      validList.push({ required: true, message: msgContent, trigger });
    } else {
      validatorMap[name] &&
        validList.push({ validator: validatorMap[name], message: msgContent, trigger });
    }
  });
  return validList;
};

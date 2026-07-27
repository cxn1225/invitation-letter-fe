<script setup lang="ts">
  import type { BusiDetailListItemType } from "@/api/model/loginModel";
  import { validRule } from "@/utils/validRule";
  import { getBusiDetailListApi, sendMsgApi, getcaptchaofloginApi, loginApi } from "@/api/login";
  import { useUserStore } from "@/store/modules/user";
  import { useRouter, useRoute } from "vue-router";
  import { showToast } from "vant";
  import SelectPopup from "@/components/base/SelectPopup.vue";

  interface AreaListItemType {
    id: string;
    name: string;
  }

  const loginData = reactive({
    areaCode: "+86", // 区号
    phone: "", // 手机号
    code: "", // 短信验证码
    textCode: "", // 图形验证码
    hxe_c_code: "", // 图形验证code
    hxe_mc_code: "", // 短信验证code
    imgSrc: "", // 图形验证码链接
    showImg: false, // 控制是否展示图形验证码
    autoLogin: 1, // 是否七天免密登录， 1是 0否
    agreen: false, // 勾选协议
  });
  const focusKey = ref(""); // 标识当前聚焦的输入框
  const areaList = ref<AreaListItemType[]>([]); // 区号下拉项
  const sendFlag = ref(false);
  const seconds = ref(59);
  let timer: ReturnType<typeof setInterval>;
  const loading = ref(false);
  const initSeconds = ref(59);
  const appKey = import.meta.env.VITE_APP_KEY; // 获取appkey
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const areaShow = ref(false); // 区号弹窗显隐
  const phoneRuleObj = {
    "+86": {
      name: "phone",
      maxLength: "11",
    },
    other: {
      name: "requireOnlyNumber",
      maxLength: "20",
    },
  };
  const actPhoneRule = computed(() => {
    return phoneRuleObj[loginData.areaCode]
      ? phoneRuleObj[loginData.areaCode]
      : phoneRuleObj["other"];
  });

  const canSendFlag = computed(() => {
    return loginData.phone && loginData.phone.length === 11 && !sendFlag.value;
  });

  // 获取登录区号
  async function getBusiDetailList() {
    const { code, data } = await getBusiDetailListApi();
    if (code === 0) {
      loginData.areaCode = data[0]?.noBusi || "+86";
      areaList.value = data.map((item: BusiDetailListItemType) => {
        return {
          id: item.noBusi,
          name: item.nameCn + item.noBusi,
        };
      });
    }
  }

  function changeHandle(item: AreaListItemType) {
    loginData.areaCode = item.id;
    loginData.phone = "";
  }

  function onFailed(errorInfo) {
    showToast(errorInfo.errors[0].message);
  }
  function focusHandler(key: string) {
    focusKey.value = key;
  }
  /**
   * @description 发送验证码
   */
  async function sendCode() {
    if (!canSendFlag.value || sendFlag.value) {
      return;
    }
    const params = loginData.showImg
      ? [
          { appKey, phone: loginData.phone, text: loginData.textCode },
          { hxe_c_code: loginData.hxe_c_code },
        ]
      : [{ appKey, phone: loginData.phone }];
    // @ts-ignore
    const { code, data } = await sendMsgApi(...params);
    if (code === 0) {
      loginData.hxe_mc_code = data.token;
      getSeconds(initSeconds.value);
    } else if (code === 10116) {
      showToast("为保证您的安全，请先输入图形验证码");
      getcaptchaoflogin();
    } else if (code === 10115) {
      showToast("图形验证码错误");
      getcaptchaoflogin();
    }
  }
  async function getcaptchaoflogin() {
    loginData.textCode = "";
    const { headers, data } = await getcaptchaofloginApi({ appKey });
    loginData.hxe_c_code = headers.hxe_c_code;
    const url = window.URL.createObjectURL(data);
    loginData.imgSrc = url;
    loginData.showImg = true;
  }
  // 发送短信读秒
  function getSeconds(count: number) {
    clearInterval(timer);
    sendFlag.value = true;
    seconds.value = count;
    timer = setInterval(() => {
      seconds.value--;
      if (seconds.value <= 0) {
        sendFlag.value = false;
        clearInterval(timer);
      }
    }, 1000);
  }
  async function loginHandle() {
    if (!loginData.agreen) {
      showToast("请阅读并勾选协议");
      return;
    }
    const webappLoginByMsgVI = {
      appKey,
      areaCode: loginData.areaCode,
      code: loginData.code,
      phone: loginData.phone.toString(),
      platform: "web",
      rememberMe: loginData.autoLogin,
      timestamp: new Date().getTime(),
      responseType: "code",
      state: "string",
    };
    loading.value = true;
    const { code, data } = await loginApi(webappLoginByMsgVI, {
      hxe_mc_code: loginData.hxe_mc_code,
    });
    loading.value = false;
    if (code !== 0) {
      return;
    }
    try {
      const toRes: any = await userStore.getUserInfo({
        code: data.code,
        rememberMe: Number(loginData.autoLogin),
        state: new Date().getTime(),
      });
      loading.value = false;
      if (toRes.code === 0) {
        if (route.query.redirect) {
          router.replace(route.query.redirect as string);
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  // 初始化
  getBusiDetailList();
</script>
<template>
  <div class="login">
    <div class="login-header">没有账号？<router-link to="">注册</router-link></div>
    <div class="login-info">
      <div class="login-logo"></div>
      <p class="login-title">登录会小二帮</p>
    </div>
    <div class="login-form">
      <van-form :show-error-message="false" @submit="loginHandle" @failed="onFailed">
        <div
          class="login-field login-field-phone"
          :class="{ 'login-field-active': focusKey === 'phone' }"
        >
          <div class="login-field-label" @click="areaShow = true">
            <span>{{ loginData.areaCode }}</span>
            <van-icon class="icon-size18" name="arrow-down" color="#1b2a38" />
          </div>
          <div class="login-field-mid"></div>
          <van-field
            v-model="loginData.phone"
            type="tel"
            placeholder="请输入手机号"
            :maxlength="actPhoneRule.maxLength"
            :rules="
              validRule({ required: '请输入手机号', [actPhoneRule.name]: '请输入正确手机号' })
            "
            :clearable="true"
            @focus="focusHandler('phone')"
            @blur="focusKey = ''"
          />
        </div>
        <div
          class="login-field login-field-between"
          :class="{ 'login-field-active': focusKey === 'code' }"
        >
          <van-field
            v-model="loginData.code"
            type="digit"
            placeholder="请输入验证码"
            maxlength="6"
            :rules="validRule('required', '请输入验证码')"
            :clearable="true"
            @focus="focusHandler('code')"
            @blur="focusKey = ''"
          />
          <a
            href="javascript:;"
            class="login-field-code"
            :class="{ 'send-message': canSendFlag }"
            @click="sendCode"
            >{{ sendFlag ? `${seconds}s后重新获取` : "获取验证码" }}</a
          >
        </div>
        <div
          v-if="loginData.showImg"
          class="login-field login-field-between"
          :class="{ 'login-field-active': focusKey === 'textCode' }"
        >
          <van-field
            v-model="loginData.textCode"
            type="text"
            placeholder="请输入图形验证码"
            maxlength="4"
            :rules="validRule('required', '请输入图形验证码')"
            :clearable="true"
            @focus="focusHandler('textCode')"
            @blur="focusKey = ''"
          />
          <van-image width="120" :src="loginData.imgSrc" @click="getcaptchaoflogin"></van-image>
        </div>
        <van-button
          class="login-submit"
          type="primary"
          native-type="submit"
          color="#FF6047"
          :loading="loading"
          block
          round
          >登录</van-button
        >
        <div class="login-agreenment">
          <van-checkbox v-model="loginData.agreen" icon-size="15px">我已阅并同意会小二</van-checkbox
          ><a href="javascript:;" class="a-link">《服务协议》</a>和<a
            href="javascript:;"
            class="a-link"
            >《隐私协议》</a
          >
        </div>
      </van-form>
    </div>
    <SelectPopup
      v-model:show="areaShow"
      :list="areaList"
      title="请选择地区"
      :active="loginData.areaCode"
      style-type="colOne"
      @change="changeHandle"
    />
  </div>
</template>
<style lang="less">
  .login {
    min-height: 100vh;
    background: #ffffff;
    a {
      color: #0056b8;
    }
    .login-header {
      padding: 48px;
      font-size: 28px;
      color: #677585;
      text-align: right;
    }
    .login-info {
      .login-logo {
        width: 102px;
        height: 102px;
        border-radius: 16px;
        background: #ff6047;
        margin: 0 auto 40px auto;
      }
      .login-title {
        font-size: 44px;
        color: #0b1929;
        text-align: center;
      }
    }
    .login-form {
      padding: 65px 60px 0 60px;
      .login-field {
        width: 100%;
        display: flex;
        align-items: center;
        height: 96px;
        border: 1px solid #c0c5cc;
        border-radius: 49px;
        padding: 0 40px;
        box-sizing: border-box;
        margin-top: 32px;
        &:first-child {
          margin-top: 0;
        }
        .van-field {
          padding: 0;
          flex: 1;
          font-size: 30px;
          &:after {
            border: none;
          }
        }
        &.login-field-active {
          border-color: #ff6047;
        }
      }
      .login-field-phone {
        .login-field-label {
          font-size: 35px;
          font-weight: bold;
          color: #1b2a38;
          .van-icon {
            margin-left: 14px;
          }
        }
        .login-field-mid {
          width: 1px;
          height: 36px;
          background: #ccd2d9;
          margin: 0 24px;
        }
      }
      .login-field-between {
        justify-content: space-between;
        .van-field {
          margin-right: 60px;
        }
        .van-image {
          height: 100%;
        }
      }
      .login-field-code {
        color: #a9b0b8;
      }
      .send-message {
        color: #ff6047;
      }
      .login-submit {
        margin: 32px 0 50px 0;
      }
      .login-agreenment {
        display: flex;
        align-items: center;
        color: #677585;
        font-size: 24px;
        .van-checkbox {
          margin-right: 15px;
        }
      }
    }
  }
</style>

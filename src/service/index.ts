import Taro from "@tarojs/taro";
import { userInfo } from "../store";
let httpUrl = "";

const interceptor = chain => {
  const requestParams = chain.requestParams;
  return chain.proceed(requestParams).then(res => {
    if (res.data.code) {
      if (res.data.code === 10002) {
        userInfo.reset();
        Taro.showModal({
          showCancel: false,
          title: "登录失效",
          content: "登录状态已失效，请重新登录",
          success: () => {
            Taro.reLaunch({
              url: "/pages/index/index"
            });
          }
        });
      }
      if (/10003|10004/.test(res.data.code)) {
        Taro.showModal({
          showCancel: false,
          title: "信息不全",
          content:
            res.data.code === 10004
              ? res.data.message
              : "门店信息不完整，请补填写后继续操作",
          success: () => {
            Taro.navigateTo({
              url: "/containers/AccountPage/index"
            });
          }
        });
      } else {
        res.data.message &&
          Taro.showToast({
            icon: "none",
            duration: 2000,
            title: `${res.data.message}`
          });
      }
    }
  });
};

Taro.addInterceptor(interceptor);

export const refreshHttp = async () => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: "https://stg-mp-hx.vvild.cn/api/v1/config/config?version=2.0",
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        httpUrl = res.data.data.domain;
        resolve(res.data.data.domain);
      },
      fail: res => {
        reject(res);
      }
    });
  });
};

const getHttp = () => {
  if (httpUrl) {
    return httpUrl;
  } else {
    return refreshHttp();
  }
};

/**
 * POST form data
 */
export const postFormData = {
  method: "POST",
  header: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

/**
 *
 */
export const postJson = {
  method: "POST"
};

/**
 *
 * @param newUrl api
 * @param options header/data
 * 默认get请求
 *
 */
export const request = async (newUrl, options?: {}) => {
  // const domain = (await getHttp()) as any;
  const domain = "api.yhdawang.top/vcapp"
  // console.log(domain);

  // const api =
  //   process.env.NODE_ENV === "development"
  //     ? // ? "stg-mp-hx.vvild.cn"
  //       "stg-mp-hx.vvild.cn"
  // : "stg-mp-hx.vvild.cn"; 
  const url = `http://${domain}/${newUrl}`

  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      header: {
        "Content-Type": "application/json"
      },
      ...options,
      success: res => {
        resolve(res.data);
      },
      fail: res => {
        reject(res);
      }
    });
  });
};

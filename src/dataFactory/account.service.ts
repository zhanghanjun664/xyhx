import { request, postJson, postFormData } from "../service";

/**
 * 获取验证码 注册
 */
export const getRegisterCode = phone => {
  return request("sms/signupCode", {
    data: { phone },
    ...postJson
  });
};

/**
 * 获取验证码 注册
 */
export const verifyCode = data => {
  return request("account/verifyCode", {
    data,
    ...postJson
  });
};

/**
 * 获取验证码 修改密码
 */
export const getResetCode = phone => {
  return request("sms/forgetCode", {
    data: { phone },
    ...postJson
  });
};

/**
 * 验证码修改密码
 */
export const resetPassword = data => {
  return request("user/modifypassword", {
    data,
    ...postJson
  });
};

/**
 * 注册
 */
export const subRegister = data => {
  return request("user/register", {
    ...postJson,
    data
  });
};

/**
 * 登录接口
 */
export const login = data => {
  return request("user/userlogin", {
    data,
    ...postFormData,
  });
};

/**
 * 退出登录
 */
export const logout = () => {
  return request("user/loginout", {
    ...postJson
  });
};

/**
 * 更新用户信息
 * 更新门店信息
 */
export const updateInfo = data => {
  return request("user/modifyshop", {
    ...postJson,
    data
  });
};

/**
 * 获取用户信息
 */
export const getAccountInfo = () => {
  return request("user/current", postJson);
};

/**
 * 增加门店
 */
export const addSaveStore = data => {
  return request("user/addshop", { ...postJson, data });
};

// 校验注册短信
export const checkValidCode = data => {
  return request("sms/checkValidCode", { ...postJson, data });
};

// 校验修改密码验证码
export const forgetCodeCheck = data => {
  return request("sms/forgetCodeCheck", { ...postJson, data });
};

// 校验名字是否可用
export const checkname = data => {
  return request("user/checkname", { data });
};
import { request, postJson } from "../service";

/**
 * 获取活动列表
 */
export const getActivityList = data => {
  return request("activity/getactivity", {
    // ...postJson,
    data
  });
};

// 已结束活动 
export const getUserEndActivity = data => {
  return request("activity/getUserEndActivity", {
    data
  });
};

/**
 * 获取参与活动列表
 */
export const getAccountActivityList = data => {
  return request("activity/useractivity", {
    // ...postJson
    data
  });
};

// 获取用户门店
export const getUserShop = data => {
    return request("activity/usershop", {
    data
  });
}

/**
 * 获取代理商
 */
export const getAgentList = () => {
  return request("user/getagent");
};

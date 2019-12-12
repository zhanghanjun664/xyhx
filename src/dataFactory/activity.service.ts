import { request, postJson, postFormData } from "../service";

/**
 * 报名参加
 */
export const joinActivity = data => {
  return request("activity/signactivity", {
    ...postFormData,
    data
  });
};

/**
 * 获取活动详情
 */
export const getActivityDetail = data => {
  return request("activity/detail", {
    ...postJson,
    data
  });
};

/**
 * 提交报销单
 */
export const subReimburseForm = data => {
  return request("verification/submit", {
    ...postJson,
    data
  });
};

/**
 * 获取报销列表
 */
export const getReimburseList = () => {
  return request("verification/list", {
    ...postJson
  });
};

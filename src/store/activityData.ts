import { Store } from "laco";

/**
 * 用户信息
 */
export const activityData = new Store({ activityList: [] }, "activityData");

/**
 * 更新用户信息
 */
export const updateActivityData = data => {
  activityData.set(() => ({ ...data }), "updateActivityData");
};

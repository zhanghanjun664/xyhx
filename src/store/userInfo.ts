import { Store } from "laco";

/**
 * 用户信息
 */

// const ui = {"userId":"864713118687690754","userName":"15627236825","userPassword":null,"headPerson":"张学友","phone":"15627236825","create_time":"2019-12-09 19:05:01"}
// export const userInfo = new Store(ui, "userInfo")

export const userInfo = new Store({}, "userInfo");

/**
 * 更新用户信息
 */
export const updateUserInfo = data => {
  userInfo.set(
    () => ({
      ...data
    }),
    "updateUserInfo"
  );
};

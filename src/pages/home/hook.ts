import Taro, { useState, useEffect } from "@tarojs/taro";
import { useStore, userInfo } from "../../store";
import { updateActivityList } from "../../utils";
import { logout } from "../../dataFactory";

export default function useHome(props) {
  const { status, updateUpdate } = props;
  const userData = useStore(userInfo);
  const [showDrawer, setShowDrawer] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "小野活动报名报销系统"
    });
  }, []);

  console.log("current=>", current)
  if (status) {
    Taro.showLoading({ title: "刷新中" });
    updateActivityList(current + 1, userData.userId);
    updateUpdate();
  }

  useEffect(() => {
    console.log(userData)
    if (!userData.userId) {
      Taro.reLaunch({
        url: "/pages/index/index"
      });
    }
  }, [userData]);

  const openChange = async type => {
    switch (type) {
      case "list":
        Taro.navigateTo({
          url: "/containers/ReimburseList/index"
        });
        break;
      case "info":
        Taro.navigateTo({
          url: "/containers/AccountPage/index"
        });
        break;
      case "password":
        Taro.navigateTo({
          url: "/containers/ChangePassword/index?title=修改密码"
        });
        break;
      case "logout":
        userInfo.reset();
        await logout();
        Taro.showToast({
          title: "已退出"
        });
        Taro.reLaunch({
          url: "/pages/index/index"
        });
        break;
    }
  };
  return { showDrawer, setShowDrawer, current, setCurrent, openChange };
}

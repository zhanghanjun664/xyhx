import Taro, { useState, useEffect } from "@tarojs/taro";
import { updateUserInfo, useStore, userInfo } from "../../store";
import { updateInfo, logout, getAccountInfo } from "../../dataFactory";

export const useAddUserInfo = () => {
  // const userData = useStore(userInfo);
  const [userData, setUserData] = useState();

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "商户信息补充"
    });
    init();
  }, []);

  console.log(userData);

  const init = async () => {
    const res: any = await getAccountInfo();
    const stores = res.stores;
    setUserData(res.data);
    console.log(stores);
    setData({
      stores: {
        address: stores.address,
        latitude: stores.point.latitude,
        longitude: stores.point.longitude,
        startTime: stores.salesTime[0],
        endTime: stores.salesTime[1],
        city: stores.city,
        salesTypeIndex: stores.salesType - 1,
        salesType: stores.salesType
      }
    });
  };

  const [data, setData] = useState();

  // 提交更新
  const saveUpdate = async () => {
    if (
      data.salesType &&
      data.startTime &&
      data.address &&
      data.endTime &&
      data.city.length !== 0 &&
      data.longitude !== 0 &&
      data.latitude !== 0
    ) {
      Taro.showLoading({
        title: "提交中"
      });
      const params = {
        type: "supplement",
        ...data,
        salesTime: { startTime: data.startTime, endTime: data.endTime },
        point: {
          longitude: data.longitude,
          latitude: data.latitude
        }
      };
      const res: any = await updateInfo(params);
      if (!res.code) {
        Taro.hideLoading();
        updateUserInfo(res.data);
        Taro.showModal({
          showCancel: false,
          content: "更新成功，需要等待重新审核",
          success: async () => {
            await logout();
            updateUserInfo({ objectId: null });
            Taro.reLaunch({
              url: "/pages/index/index"
            });
          }
        });
      }
    } else {
      Taro.showToast({
        icon: "none",
        title: "填写信息不全"
      });
    }
  };

  return { data, setData, saveUpdate };
};

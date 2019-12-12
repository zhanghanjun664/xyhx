import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton } from "taro-ui";
import { updateUserInfo } from "../../store";
import { getAccountInfo } from "../../dataFactory";
import style from "./style.module.scss";

export default function Content() {
  const [isLogin, setIsLogin] = useState(false);
  const toRegister = () =>
    Taro.navigateTo({
      url: "/containers/Register/index"
    });
  // console.log("useState=.", useState)

  const toLogin = async () => {
    Taro.showLoading({
      title: "检测登录状态"
    });
    if (!isLogin) {
      setIsLogin(true);
      const res: any = await getAccountInfo();
      console.log(res)
      if (res && res.code == "10000" && !res.subCode) {
        Taro.hideLoading();
        updateUserInfo(res.data);
        Taro.reLaunch({
          url: "/pages/home/index"
        });
      } else {
        Taro.hideLoading();
        Taro.navigateTo({
          url: "/containers/Login/index"
        });
      }
    } else {
      Taro.hideLoading();
      Taro.navigateTo({
        url: "/containers/Login/index"
      });
    }
  };

  return (
    <View>
      <View className={style.wrapper}>
        <View className={style.title}>
          注册/登录经销商账号
          <View>即可报名参加线下活动报销</View>
        </View>
        <View className={style.content}>
          <AtButton type="primary" onClick={toLogin}>
            登录
          </AtButton>
          <View className={style.block} />
          <AtButton type="primary" onClick={toRegister}>
            注册
          </AtButton>
        </View>
      </View>
    </View>
  );
}

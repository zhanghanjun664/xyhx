import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtInput } from "taro-ui";
import { login } from "../../dataFactory";
import { updateUserInfo } from "../../store";
import style from "./style.module.scss";

export default function Index() {
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "登录"
    });
  }, []);

  const [account, setAccount] = useState({
    username: "",
    password: ""
  });

  const update = (value, type) => {
    account[type] = value;
    setAccount(account);
  };

  const loginButton = async () => {
    if (account.password.length >= 6 && account.username.length >= 11) {
      Taro.showLoading({
        title: "登录中"
      });
      const res: any = await login(account);
      // if (res.code === 10001 && res.data) {
      //   updateUserInfo(res.data);
      //   Taro.showModal({
      //     title: "提示",
      //     content: "账户审核不通过，请重新提交注册",
      //     showCancel: false,
      //     success: () => {
      //       Taro.reLaunch({
      //         url: "/containers/Register/index?from=login"
      //       });
      //     }
      //   });
      // }
      if (res && res.data) {
        updateUserInfo(res.data);
        Taro.showToast({
          title: "登录成功"
        });
        Taro.reLaunch({
          url: "/pages/home/index"
        });
      } else {
        Taro.showToast({
          title: res.msg,
          icon: "none"
        });
      }
    } else {
      Taro.showToast({
        title: "请输入完整信息",
        icon: "none"
      });
    }
  };

  return (
    <View className={style.wrapper}>
      <View className={`at-article__h1 ${style.title}`}>登录</View>
      <AtInput
        title="账号"
        name="phone"
        type="number"
        placeholder="输入手机号"
        maxLength={11}
        value={account.username}
        onChange={e => update(e, "username")}
      />
      <AtInput
        title="密码"
        name="password"
        type="password"
        placeholder="请输入密码"
        value={account.password}
        onChange={e => update(e, "password")}
      />
      <View
        className={`at-article__p ${style.password}`}
        onClick={() => {
          Taro.navigateTo({
            url: "/containers/ChangePassword/index?title=忘记密码"
          });
        }}
      >
        忘记密码？
      </View>
      <View className={style.login}>
        <AtButton type="primary" onClick={loginButton}>
          登录
        </AtButton>
      </View>
    </View>
  );
}

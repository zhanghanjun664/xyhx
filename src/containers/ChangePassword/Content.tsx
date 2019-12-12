import Taro, { useEffect, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import { getResetCode, resetPassword, forgetCodeCheck } from "../../dataFactory";
import { useStore, userInfo } from "../../store";
import style from "./style.module.scss";

export default function Content(props) {
  const userDate = useStore(userInfo);
  const { title } = props;
  const [getCode, setGetCode] = useState(true);
  const [account, setAccount] = useState({
    username: userDate.mobilePhoneNumber || "",
    password: "",
    validCode: ""
  });

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title
    });
  }, []);

  const update = (value, type) => {
    account[type] = value;
    setAccount(account);
  };

  const sub = async () => {
    if (
      account.username.length >= 11 &&
      account.validCode.length >= 6 &&
      account.password.length >= 7
    ) {
      // 校验验证码
      const resp: any = await forgetCodeCheck({validCode: account.validCode, phone: account.username});
      console.log("resp==>", resp)
      if(resp && resp.code == "10000" && resp.subCode == null){
        const res: any = await resetPassword(account);
        if (res && res.code == "10000") {
          Taro.showToast({
            title: "密码修改成功"
          });
          Taro.navigateBack({
            delta: 1
          });
        }

      } else {
        Taro.showToast({
          icon: "none",
          title: "验证码有误"
        });
      }
      
    } else if (account.password.length < 7) {
      Taro.showToast({
        title: "新密码最少7位",
        icon: "none"
      });
    } else {
      Taro.showToast({
        title: "填写信息不正确",
        icon: "none"
      });
    }
  };

  const subCode = async () => {
    if (!getCode) {
      Taro.showToast({
        title: "60秒只能发送一次",
        icon: "none"
      });
      return;
    }
    if (account.username.length >= 11 && getCode) {
      const res: any = await getResetCode(account.username);
      if (res && res.code == "10000") {
        setGetCode(false);
        setTimeout(() => {
          setGetCode(true);
        }, 60000);
        Taro.showToast({
          title: "发送成功"
        });
      }
    } else {
      Taro.showToast({
        title: "请输入完整手机号",
        icon: "none"
      });
    }
  };

  return (
    <View className={style.wrapper}>
      <View className={style.title}>{title}</View>
      <AtInput
        title="手机号"
        name="username"
        placeholder="输入手机号"
        maxLength={11}
        type="number"
        value={account.username}
        onChange={value => update(value, "username")}
      />
      <AtInput
        title="验证码"
        name="validCode"
        type="number"
        placeholder="输入验证码"
        maxLength={6}
        value={account.validCode}
        onChange={value => update(value, "validCode")}
      >
        <View
          className="at-article__info"
          style={{ opacity: getCode ? 1 : 0.3 }}
          onClick={subCode}
        >
          获取验证码
        </View>
      </AtInput>
      <AtInput
        title="新密码"
        placeholder="输入7位以上新密码"
        name="password"
        type="password"
        value={account.password}
        onChange={value => update(value, "password")}
      />
      <View className={style.changeButton}>
        <AtButton type="secondary" onClick={sub}>
          修改密码
        </AtButton>
      </View>
    </View>
  );
}

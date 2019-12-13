import { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput, AtButton } from "taro-ui";
import { getRegisterCode, subRegister, checkValidCode, checkname } from "../../dataFactory";
import { uploadFileArray, uploadFiles } from "../../utils";
import style from "./style.module.scss";

export default function Content(props) {
  const { update, data = { userName: "" }, setData } = props;
  const [isUpload, setIsUpload] = useState(false);

  const subCode = async () => {
    // console.log("data=>", data)
    if (data.userName.length >= 11) {
      const res: any = await getRegisterCode(String(data.userName));
      if (res && res.code == "10000") {
        Taro.showToast({
          title: "发送成功"
        });
      }
    } else {
      Taro.showToast({
        icon: "none",
        title: "请输入手机号"
      });
    }
  };

  const uploadImg = () => {
    const newData = data;
    return new Promise(resolve => {
      newData.shopList.map(async (itme, index) => {
        await uploadFiles(itme.imgList)
          // 上传成功
          .then(list => {
            newData.shopList[index].imgList = list;
            // newData.shopList[index].image = list;
            setData(newData);
            resolve(newData);
          })
          // 上传发生异常
          .catch(console.error);
      });
    });
  };

  const sub = async () => {

    Taro.showLoading({
      title: "提交中",
      mask: true
    });
    if (
      data.userPassword.length >= 7 &&
      data.userName.length >= 11 &&
      data.code.length >= 6
    ) {
      // 校验名字是否可用
      const response: any = await checkname({username: data.userName})
      
      if(response && response.code === "10000" && response.subCode ){
        return Taro.showToast({
          icon: "none",
          title: "用户名已存在"
        });
      }


      // 校验注册短信
      const resp: any =await checkValidCode({phone: data.userName, validCode: data.code})
      // 校验通过
      if(resp && resp.code == "10000" && resp.subCode == null){
        setIsUpload(true);
        // 上传过图片了就不会再上传一遍了
        const newStore: any = isUpload ? data : await uploadImg();

        newStore.phone = newStore.userName
        newStore.shopList.map(item => {

          item.shopImg1 = item.imgList[0]
          item.shopImg2 = item.imgList[1]

          let citys = item.city
          item.province = citys[0];
          item.city = citys[1];
          item.area = citys[2];

          //处理原有数据
          delete data.code
          delete item.imgList
          delete item.affiliation
          delete item.agent
          item.shopPhone = ""
          item.agentId = Number(item.agentId)
          item.longitude = String(item.longitude)
          item.latitude = String(item.latitude)


        });
        const res: any = await subRegister(newStore);
        if (res && res.code == "10000") {
          Taro.hideLoading();
          Taro.showModal({
            title: "已提交至审核",
            content: "注册审核通过时将以短信形式通知到您到手机",
            showCancel: false,
            complete: () => {
              Taro.reLaunch({
                url: "/containers/Login/index"
              });
            }
          });
        }

      } else {
        Taro.showToast({
          icon: "none",
          title: "验证码有误"
        });
      }
      
      
    } else if (data.userPassword.length < 7) {
      Taro.showToast({
        icon: "none",
        title: "密码至少7位"
      });
    } else {
      Taro.showToast({
        icon: "none",
        title: "请输入完整内容"
      });
    }
  };

  return (
    <View>
      <View>
        <AtInput
          title="* 手机号"
          name="userName"
          type="number"
          placeholder="输入手机号"
          value={data.userName}
          maxLength={11}
          onChange={value => update({ type: "userName", value })}
        />
        <AtInput
          clear
          name="code"
          title="* 验证码"
          type="number"
          maxLength={6}
          placeholder="输入验证码"
          value={data.code}
          onChange={value => update({ type: "code", value })}
        >
          <View onClick={subCode}>发送验证码</View>
        </AtInput>
        <AtInput
          title="* 密码"
          placeholder="输入密码"
          name="userPassword"
          type="password"
          value={data.userPassword}
          onChange={value => update({ type: "userPassword", value })}
        />
      </View>
      <View className={style.subButton}>
        <AtButton type="primary" onClick={sub}>
          提交申请
        </AtButton>
      </View>
    </View>
  );
}

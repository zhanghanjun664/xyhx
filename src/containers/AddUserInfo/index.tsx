import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Location from "../../components/Location";
import style from "./style.module.scss";
import { AtButton } from "taro-ui";
import { useAddUserInfo } from "./hook";

export default function Index() {
  const { data, setData, saveUpdate } = useAddUserInfo();
  return (
    <View className={style.wrapper}>
      <Location {...{ data, setData }} />
      <View className={style.save}>
        <AtButton type="secondary" onClick={saveUpdate}>
          保存提交
        </AtButton>
      </View>
    </View>
  );
}

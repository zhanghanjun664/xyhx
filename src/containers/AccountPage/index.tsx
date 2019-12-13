import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useStore, userInfo, updateUserInfo } from "../../store";
import { AtTabs, AtTabsPane, AtInput } from "taro-ui";
import { getAgentList, updateInfo, getAccountInfo, modifuserhead } from "../../dataFactory";
import style from "./style.module.scss";
import Content from "./content";

export default function Index() {
  const userData = useStore(userInfo);
  console.log("user=>", userData)
  const { shopList = [], headPerson, userId } = userData;
  const [name, setName] = useState(headPerson);
  const [current, setCurrent] = useState(0);
  const [storesList, setStoresList] = useState();
  const [agentList, setAgentList] = useState([]);
  useEffect(() => {
    // if (isSupplement === false) {
    //   shopList[0].new = true;
    // }
    setStoresList(shopList);
    setName(headPerson);
    setCurrent(current);
  }, [userData]);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "我的门店"
    });
    refreshUserInfo();
  }, []);

  const refreshUserInfo = async () => {
    const { data: list }: any = await getAgentList();
    setAgentList(list);
    const { data }: any = await getAccountInfo();
    updateUserInfo(data);
  };

  const addStore = () => {
    storesList.push({
      shopName: "",
      city: [],
      // new: true,
      attachments: []
    });
    setCurrent(storesList.length - 1);
    setStoresList(storesList);
  };

  const saveUserInfo = async () => {
    const res: any = await modifuserhead({ userid: userId, headPerson: name });
    if(res && res.code == "10000"){
      Taro.showToast({ title: "保存成功" });
    }
    const { data }: any = await getAccountInfo();
    updateUserInfo(data);
  };

  const tabList: any = [];
  if (storesList) {
    storesList.forEach(item => {
      const params = {
        title: item.shopName ? item.shopName : "未命名"
      };
      tabList.push(params);
    });
  }

  return (
    <View className={style.wrapper}>
      <View className={style.title}>我的门店</View>
      <View className={style.h2}>负责人姓名</View>
      <AtInput
        title="负责人"
        name="name"
        type="text"
        placeholder="请输入负责人姓名"
        value={name}
        maxLength={10}
        onChange={e => setName(e)}
      >
        <View onClick={saveUserInfo} className={style.saveUserInfo}>
          保存姓名
        </View>
      </AtInput>
      <View className={style.addBar}>
        <View>名下门店</View>
        <View className={style.add} onClick={addStore}>
          添加门店
        </View>
      </View>
      <AtTabs
        current={current}
        swipeable={false}
        tabList={tabList}
        scroll={true}
        onClick={i => setCurrent(i)}
      >
        {storesList &&
          storesList.map((item, i) => {
            let attachments = []
            if(item.shopImg1 && item.shopImg2){
              attachments = [item.shopImg1, item.shopImg2]
            }
            console.log("storesList==>", attachments, item)
            return (
              <AtTabsPane key={item.shopName} current={current} index={i}>
                <Content {...{ ...item, name, agentList, attachments }} />
              </AtTabsPane>
            );
          })}
      </AtTabs>
    </View>
  );
}

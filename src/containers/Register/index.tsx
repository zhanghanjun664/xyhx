import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { useRegister, defaultData } from "./hook";
import { AtButton, AtInput, AtAccordion } from "taro-ui";
import Store from "../../components/Store";
import Content from "./content";
import style from "./style.module.scss";

export default function Register() {
  const dataInfo = useRegister();
  const { currentId, next, update, data, setData, agentList } = dataInfo;

  const addStore = () => {
    data.shopList.push(JSON.parse(JSON.stringify(defaultData)));
    setData(data);
  };

  const deleteStore = index => {
    data.shopList.splice(index, 1);
    setData(data);
  };

  return (
    <View className={style.wrapper}>
      <View className="at-article__h1">注册 {currentId} / 2</View>
      {currentId === 2 ? (
        <Content {...dataInfo} />
      ) : (
        <View>
          <AtInput
            title="* 负责人"
            name="headPerson"
            placeholder="请输入负责人姓名"
            value={data.headPerson}
            onChange={value => update({ type: "headPerson", value })}
          />
          {data.shopList.map((item, index) => {
            const [open, setOpen] = useState(true);
            return (
              <View key={index}>
                <AtAccordion
                  title="注册门店"
                  open={open}
                  onClick={() => setOpen(!open)}
                >
                  <Store
                    {...{
                      data: item,
                      stateData: data,
                      index,
                      update,
                      setData,
                      agentList
                    }}
                  />
                  {index !== 0 && (
                    <AtButton
                      onClick={() => deleteStore(index)}
                      type="secondary"
                    >
                      删除门店
                    </AtButton>
                  )}
                </AtAccordion>
              </View>
            );
          })}
          <View className={style.block}>
            <AtButton type="secondary" onClick={addStore}>
              添加门店
            </AtButton>
          </View>
          <View className={style.block}>
            <AtButton type="primary" onClick={next}>
              下一步
            </AtButton>
          </View>
        </View>
      )}
    </View>
  );
}

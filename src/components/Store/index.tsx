import Taro from "@tarojs/taro";
import { View, Picker, Image } from "@tarojs/components";
import { AtInput, AtIcon } from "taro-ui";
import Location from "../Location";
import style from "./style.module.scss";

export default function Store(props) {
  const { stateData, data, setData, update, agentList = [], index } = props;

  const list: any = [];
  agentList.forEach((item: any) => list.push(item.agentName));

  const selectImg = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        update({ type: "addImgList", value: res.tempFilePaths[0], index });
      }
    });
  };

  const regSetData = info => {
    stateData.shopList[index] = info;
    setData(stateData);
  };

  return (
    <View>
      {data && (
        <View className={style.wrapper}>
          <View className={style.h2}>您属于哪一个代理商负责：</View>
          <Picker
            mode="selector"
            range={list}
            value={data.agent || 0}
            onChange={e => {
              update({ type: "agent", value: e.detail.value, index });
              update({
                type: "agentId",
                value: (agentList[e.detail.value] as any).agentId,
                index
              });
            }}
          >
            <View className={style.h3}>
              {data.agent ? list[data.agent || 0] : "* 请选择代理商"}
            </View>
          </Picker>
          <View className={style.h2}>门店名称：</View>
          <AtInput
            title="* 门店名称"
            name="shopName"
            placeholder="请输入门店名称"
            value={data.shopName}
            onChange={value => update({ type: "shopName", value, index })}
          />
          <View>
            <View className={style.h2}>门店照片：</View>
            <View className={style.h3}>
              * 门店以及产品售卖场景各一张（共两张）
            </View>
            <View className={style.imgList}>
              {(data.imgList || []).map((item, index) => {
                return (
                  <View key={item} className={style.item}>
                    <View
                      className={style.delete}
                      onClick={() => {
                        data.imgList.splice(index, 1);
                        update({
                          type: "imgList",
                          value: data.imgList,
                          index
                        });
                      }}
                    >
                      删除
                    </View>
                    <Image
                      src={item}
                      className={style.img}
                      mode="widthFix"
                      onClick={() => {
                        Taro.previewImage({
                          urls: [item]
                        });
                      }}
                    />
                  </View>
                );
              })}
              {data.imgList.length < 2 && (
                <View className={style.item} onClick={selectImg}>
                  <AtIcon value="add" />
                </View>
              )}
            </View>
          </View>
          <View className={style.location}>
            <Location data={data} setData={regSetData} />
          </View>
        </View>
      )}
    </View>
  );
}

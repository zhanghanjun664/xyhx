import Taro, { useEffect } from "@tarojs/taro";
import { View, Picker, Map } from "@tarojs/components";
import { AtInput } from "taro-ui";
import style from "./style.module.scss";

const list = [
  { name: "授权店", id: 0 },
  { name: "专卖店", id: 1 },
];

export default function Location(props) {
  const {
    data = {
      city: [],
      latitude: "",
      longitude: "",
      openTime: "",
      closeTime: "",
      addressInfo: "",
    },
    setData
  } = props;

  const mapDom = Taro.createMapContext("maps", this);

  const items: any = [];
  list.forEach(item => {
    return items.push(item.name);
  });

  useEffect(() => {
    if (data.new) {
      getLocation();
    }
  }, []);

  const getLocation = () => {
    Taro.getLocation({
      type: "gcj02",
      altitude: true,
      success: laco => {
        // 储存坐标
        update("latitude", laco.latitude);
        update("longitude", laco.longitude);
      }
    });
  };

  const update = (type, value) => {
    data[type] = value;
    setData(data);
  };

  return (
    <View className={style.wrapper}>
      <View className={style.h2}>门店类型</View>
      <Picker
        mode="selector"
        range={items}
        value={data.shopType || 0}
        onChange={e => {
          // update("salesTypeIndex", Number(e.detail.value));
          // update("salesType", list[e.detail.value].id);
          update("shopType", list[e.detail.value].id)
        }}
      >
        <View className={style.h3}>
          {data.shopType || data.shopType === 0
            ? list[data.shopType].name
            : "* 点击这里选择商店类型"}
        </View>
      </Picker>
      <View className={style.h2}>营业时间（24小时制）</View>
      {[
        { title: "开始营业", type: "openTime", value: data.openTime },
        { title: "结束营业", type: "closeTime", value: data.closeTime }
      ].map(item => {
        return (
          <Picker
            {...item}
            mode="time"
            key={item.type}
            onChange={e => {
              update(item.type, e.detail.value);
            }}
          >
            <View className={style.h3}>
              {item.title}：{item.value || "* 请点击这里选择时间"}
            </View>
          </Picker>
        );
      })}
      <View className={style.h2}>门店地址</View>
      <Picker
        mode="region"
        value={data.city}
        onChange={e => update("city", e.detail.value)}
      >
        <View className={style.h3}>
          {data.city.length !== 0 ? data.city.join(" ") : "* 请选择城市地区"}
        </View>
      </Picker>
      <AtInput
        name="addressInfo"
        title="详细地址"
        placeholder="请输入门店详细地址"
        value={data.addressInfo}
        onChange={value => update("addressInfo", value)}
      />
      <View className={style.toast}>
        * 请将地址具体填写到x层x号，以确保用户可以找到门店
      </View>
      <View className={style.h3}>拖动地图定位到店铺位置</View>
      <Map
        markers={[{ latitude: data.latitude, longitude: data.longitude }]}
        latitude={data.latitude}
        longitude={data.longitude}
        id="maps"
        className={style.map}
        onRegionChange={e => {
          if (e.detail.type === "end") {
            mapDom.getCenterLocation({
              success: laco => {
                update("latitude", laco.latitude);
                update("longitude", laco.longitude);
              }
            });
          }
        }}
      />
    </View>
  );
}

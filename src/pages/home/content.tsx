import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtIcon } from "taro-ui";
import Drawer from "./drawer";
import useHome from "./hook";
import List from "./list";
import style from "./style.module.scss";

const items = [{ title: "活动报名" }, { title: "进行中" }, { title: "已结束" }];

export default function Content(props) {
  const {
    current,
    setCurrent,
    showDrawer,
    setShowDrawer,
    openChange
  } = useHome(props);
  return (
    <View>
      <Drawer {...{ showDrawer, setShowDrawer, openChange }} />
      <View className={style.me} onClick={() => setShowDrawer(true)}>
        <AtIcon value="menu" size="25" color="red" />
      </View>
      <View>
        <AtTabs current={current} tabList={items} onClick={i => setCurrent(i)}>
          {items.map((item, i) => {
            return (
              <AtTabsPane key={item.title} current={current} index={i}>
                {current === i ? <List typeIndex={i + 1} {...item} /> : ""}
              </AtTabsPane>
            );
          })}
        </AtTabs>
      </View>
    </View>
  );
}

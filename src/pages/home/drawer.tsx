import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtDrawer } from "taro-ui";
import { useStore, userInfo } from "../../store";
import "taro-ui/dist/style/index.scss";
import style from "./style.module.scss";

export default function Drawer(props) {
  const userDate = useStore(userInfo);
  const { showDrawer, setShowDrawer, openChange } = props;

  return (
    <AtDrawer show={showDrawer} mask onClose={() => setShowDrawer(false)}>
      <View className={style.topBox}>
        <View className={style.cont}>
          <View className={style.twill} />
        </View>
        <View className="at-article__h1">小野活动报销</View>
        {/* <View className="at-article__h3">{userDate.storeName}</View> */}
        <View className="at-article__h3">{userDate.name}</View>
        <View className="at-article__h3">{userDate.stores.length} 家门店</View>
        <View className="at-article__h3">{userDate.mobilePhoneNumber}</View>
        {/* {userDate.city && (
          <View className="at-article__h3">{userDate.city.join("-")}</View>
        )} */}
      </View>
      <View className={style.itemBox}>
        <View className="at-article__p" onClick={() => openChange("info")}>
          我的门店
        </View>
        <View className="at-article__p" onClick={() => openChange("list")}>
          报销列表
        </View>
        <View className="at-article__p" onClick={() => openChange("password")}>
          修改密码
        </View>
        <View className="at-article__p" onClick={() => openChange("logout")}>
          退出登录
        </View>
      </View>
    </AtDrawer>
  );
}

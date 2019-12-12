import Taro, { useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import cx from "classname";
import { transformTime, updateActivityList } from "../../utils";
import { useStore, activityData, userInfo } from "../../store";
import { logout } from "../../dataFactory";
import style from "./style.module.scss";

export default function List(props) {
  const userData = useStore(userInfo);
  const { activityList } = useStore(activityData);
  const { typeIndex } = props;

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    console.log("userData=>", userData)
    if (userData.userId) {
      Taro.showLoading({
        title: "加载列表"
      });
      Taro.showShareMenu({
        withShareTicket: true
      });
      updateActivityList(typeIndex, userData.userId);
    } else {
      userInfo.reset();
      Taro.reLaunch({
        url: "/pages/index/index"
      });
    }
  };

  // 打开详情
  const openDetali = item => {
    Taro.navigateTo({
      url: `/containers/ActivityDetail/index?activitysId=${item.activitysId}`
    });
  };

  const statusMapper = {
    1: "报名中",
    2: "进行中",
    3: "报销中"
  }

  const descMapper = {
    1: "报名截止于",
    2: "活动截止于",
    3: "报销截止于"
  }

  const timeField = {
    1: "signEndTime",
    2: "activityEndTime",
    3: "reimbEndTime"
  }

  return (
    <View>
      <View>
        {activityList.length !== 0 ? (
          activityList.map((item: any) => {
            return (
              <View
                className={style.box}
                onClick={() => openDetali(item)}
                key={item.activitysId}
              >
                <View className={style.title}>{item.activityName}</View>
                <View className={style.content}>
                  <View className={style.activity}>
                    {/* {item.activityStatus || "无限期"} */}
                    {descMapper[item.status]}
                  </View>
                  {item[timeField[item.status]] && (
                    <View>{transformTime(item[timeField[item.status]])}</View>
                  )}
                </View>
                <View className={cx(style.status, item.active && style.active)}>
                  {/* {item.activeStatus} */}
                  {statusMapper[item.status]}
                </View>
              </View>
            );
          })
        ) : (
          <View className={style.toast}>您未参加过任何活动</View>
        )}
      </View>
    </View>
  );
}

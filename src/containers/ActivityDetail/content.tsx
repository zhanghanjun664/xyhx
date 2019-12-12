import Taro, { useState } from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import { AtButton, AtNoticebar, AtCheckbox } from "taro-ui";
import { transformTime } from "../../utils";
import { useActivity } from "./hook";
import "taro-ui/dist/style/index.scss";
import style from "./style.module.scss";

export default function Content(props) {
  const [open, setOpen] = useState(false);
  const [openreimburse, setOpenReimburse] = useState(false);
  const {
    info,
    text,
    showReimburse,
    showSignUp,
    reimburse,
    signUp,
    checkboxOption,
    checkedList,
    setCheckedList
  } = useActivity(props);

  const statusMapper = {
    1: "报名中",
    2: "进行中",
    3: "报销中"
  }
  // console.log("checkboxOption=>", checkboxOption)

  return (
    <View className={`at-article ${style.wrapper}`}>
      {info && info.status && text && <AtNoticebar>{text}</AtNoticebar>}
      {open && (
        <View className={style.checkBox} onClick={() => setOpen(false)}>
          <View className={style.box} onClick={e => e.stopPropagation()}>
            <View className="at-article__h2">请选择门店报名</View>
            <AtCheckbox
              options={checkboxOption}
              selectedList={checkedList}
              onChange={value => setCheckedList(value)}
            />
            <AtButton
              onClick={() => {
                signUp();
                setOpen(false);
              }}
              type="primary"
            >
              确定报名
            </AtButton>
          </View>
        </View>
      )}
      {openreimburse && (
        <View
          className={style.checkBox}
          onClick={() => setOpenReimburse(false)}
        >
          <View className={style.box} onClick={e => e.stopPropagation()}>
            <View className="at-article__h2">请选择一个已报名的门店报销</View>
            {
              (checkboxOption || []).map((item: any) => {
                return (
                  <View
                    key={item.value}
                    className={style.storeItem}
                    style={{ opacity: item.disabled ? 0.3 : 1 }}
                    onClick={() => {
                      if (!item.disabled) {
                        reimburse(item.value);
                        setOpenReimburse(false);
                      }
                    }}
                  >
                    {item.label}
                  </View>
                );
              })
            }
          </View>
        </View>
      )}
      <View className="at-article__h1">
        {info.activityName} [{statusMapper[info.status]}]
      </View>
      <View className="at-article__h2">活动时间</View>
      <View className="at-article__p">
        {info && info.signEndTime && (
          <View>报名截止 {transformTime(info.signEndTime, true)}</View>
        )}
        {info && info.activityStartTime && (
          <View>活动开始 {transformTime(info.activityStartTime, true)}</View>
        )}
        {info && info.activityEndTime && (
          <View>活动结束 {transformTime(info.activityEndTime, true)}</View>
        )}
        {info && info.reimbStartTime && (
          <View>报销开始 {transformTime(info.reimbStartTime, true)}</View>
        )}
        {info && info.reimbEndTime && (
          <View>报销结束 {transformTime(info.reimbEndTime, true)}</View>
        )}
      </View>
      <View className="at-article__h2">活动说明</View>
      <View className="at-article__p">
        <RichText nodes={info.activityDesc} />
      </View>
      <View className="at-article__h2">参与商品</View>
      <View className="at-article__p">{info.productName}</View>
      <View className="at-article__h2">活动赠品</View>
      <View className="at-article__p">{info.activityGift}</View>
      
      {info && showSignUp && checkboxOption && checkboxOption.length > 0 && (
        <View className={style.signUp}>
          <AtButton type="primary" onClick={() => setOpen(true)}>
            立即报名
          </AtButton>
        </View>
      )}
      {info && showReimburse && checkboxOption.length > 0 && (
        <View className={style.signUp}>
          <AtButton type="primary" onClick={() => setOpenReimburse(true)}>
            赠品报销
          </AtButton>
        </View>
      )}
    </View>
  );
}

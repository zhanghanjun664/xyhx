import Taro from "@tarojs/taro";
import { View, Image, Picker } from "@tarojs/components";
import { AtInput, AtButton, AtIcon, AtNoticebar } from "taro-ui";
import Location from "../../components/Location";
import useAccount from "./hook";
import cx from "classname";
import style from "./style.module.scss";

export default function Content(props) {
  const { agentList = [] } = props;
  const { data, setData, update, saveInfo } = useAccount(props);
  const { attachments } = data;
  // attachments = attachments.filter(i=>i)
  // const attachments = [shopImg1, shopImg2]
  // const attachments = []

  const selectImg = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        console.log("res.tempFilePaths[0]=>", res.tempFilePaths)
        update(res.tempFilePaths[0], "addImgList");
      }
    });
  };

  const list: any = [];
  agentList.forEach((item: any) => list.push(item.agentName));

  let agent = "";
  if (data.affiliation) {
    const i = agentList.filter(
      i => i.agentId === data.affiliation.agentId
    )[0];
    if (i) agent = i.agentName;
  } else if(data.agentId){
    console.log("有agentId")
    agent = agentList.filter(i=>i.agentId == data.agentId)[0].agentName
  }

  let msgStatus = "";
  switch (data.status) {
    case 1:
      msgStatus = "门店审核中，不建议修改信息";
      break;
    case 3:
      msgStatus = "审核不通过";
      break;
  }

  return (
    <View>
      {msgStatus && <AtNoticebar>{msgStatus}</AtNoticebar>}
      <View>
        <View className={style.h2}>代理商</View>
        <Picker
          mode="selector"
          range={list}
          value={data.agentId || 0}
          onChange={e => {
            update(
              { agentId: (agentList[e.detail.value] as any).agentId },
              "affiliation"
            );
          }}
        >
          <View className={style.h3}>
            {data.affiliation||data.agentId ? agent : "* 请选择代理商"}
          </View>
        </Picker>
        <View className={style.h2}>门店名称</View>
        <AtInput
          title="门店名称"
          name="shopName"
          placeholder="请输入门店名称"
          value={data.shopName}
          onChange={val => update(val, "shopName")}
        />
        <Location {...{ data, setData }} />
        <View className={style.h2}>门店照片</View>
        <View>
          <View className={style.h3}>* 门店以及产品售卖场景各一张</View>

          <View className={style.imgList}>
            {attachments.map((item, index) => {
              return (
                <View key={item} className={style.item}>
                  <View
                    className={style.delete}
                    onClick={() => {
                      attachments.splice(index, 1);
                      update(attachments, "attachments");
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
            {attachments.length < 2 && (
              <View className={style.item} onClick={selectImg}>
                <AtIcon value="add" />
              </View>
            )}
          </View>
        </View>
        <View className={style.saveButton}>
          <AtButton type="primary" onClick={saveInfo}>
            保存
          </AtButton>
        </View>
      </View>
    </View>
  );
}

import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtAccordion, AtList, AtListItem } from "taro-ui";
import { getReimburseList } from "../../dataFactory";
import { transformTime } from "../../utils";
import style from "./style.module.scss";

export default function Index() {
  const [list, setList] = useState();
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    Taro.setNavigationBarTitle({
      title: "报销列表"
    });
    const res: any = await getReimburseList();

    if (!res.code) {
      setList(res.data);
    }
  };

  return (
    <View>
      {list &&
        list.map((item: any) => {
          const [open, setOpen] = useState(false);
          const icon = {
            value:
              item.status === 3
                ? "close-circle"
                : item.status === 2
                ? "check-circle"
                : "clock",
            color:
              item.status === 3 ? "red" : item.status === 2 ? "#13ce66" : ""
          };
          return (
            <View key={item.createdAt}>
              <AtAccordion
                icon={{ ...icon, size: "25" }}
                open={open}
                onClick={() => setOpen(!open)}
                title={`提交日期：${transformTime(item.createdAt)}`}
              >
                <AtList hasBorder={false}>
                  <AtListItem title={`活动：${item.activity.activity.title}`} />
                </AtList>
                {item.product.map(product => {
                  return (
                    <AtList hasBorder={false} key={product.name}>
                      <AtListItem
                        title={`商品：${product.name}`}
                        note={`数量：${product.num}`}
                      />
                    </AtList>
                  );
                })}
                {item.gift.map(gift => {
                  return (
                    <AtList hasBorder={false} key={gift.name}>
                      <AtListItem
                        title={`赠品：${gift.name}`}
                        note={`数量：${gift.num}`}
                      />
                    </AtList>
                  );
                })}
                <View>
                  {item.attachments.map(img => {
                    return (
                      <Image
                        onClick={() => {
                          Taro.previewImage({
                            urls: [img.url]
                          });
                        }}
                        mode="widthFix"
                        style={{ width: "230rpx", margin: "0 10rpx" }}
                        src={img.url}
                      />
                    );
                  })}
                </View>
              </AtAccordion>
            </View>
          );
        })}
      {(list.length === 0 || !list) && (
        <View className={style.toast}>暂无提交记录</View>
      )}
    </View>
  );
}

import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { useReimburse } from "./hook";
import { AtInput, AtButton, AtIcon } from "taro-ui";
import style from "./style.module.scss";

export default function Reimburse(props) {
  const {
    data,
    update,
    product,
    updateState,
    gift,
    selectImg,
    subForm,
    subCode,
    deleteItem,
    getCode
  } = useReimburse(props);

  return (
    <View>
      <View className={style.cont}>
        <View className={style.twill} />
      </View>
      <View className={style.wrapper}>
        <View className={style.box}>
          {product.map((item, index) => {
            return (
              <View key={`product${index}`} className={style.item}>
                <AtInput
                  name="prdname"
                  title="* 购买商品"
                  placeholder="输入商品名称"
                  value={item.name}
                  onChange={e => {
                    item.name = e;
                    updateState("product");
                  }}
                />
                <AtInput
                  name="prdnum"
                  type="number"
                  title="* 购买数量"
                  value={item.num}
                  onChange={e => {
                    item.num = Number(e);
                    updateState("product");
                  }}
                />
                {product.length > 1 && (
                  <View
                    className={style.delete}
                    onClick={() => deleteItem(index, "product")}
                  >
                    删除商品
                  </View>
                )}
              </View>
            );
          })}
          <View
            className={style.addButton}
            onClick={() => {
              product.push({ name: "", num: 0 });
              updateState("product");
            }}
          >
            添加商品
          </View>
        </View>
        <View className={style.box}>
          {gift.map((item, index) => {
            return (
              <View key={`gift${index}`} className={style.item}>
                <AtInput
                  name="prdname"
                  title="* 赠送礼品"
                  placeholder="输入赠品名称"
                  value={item.name}
                  onChange={e => {
                    item.name = e;
                    updateState("gift");
                  }}
                />
                <AtInput
                  name="giftnum"
                  type="number"
                  title="* 赠送数量"
                  value={item.num}
                  onChange={e => {
                    item.num = Number(e);
                    updateState("gift");
                  }}
                />
                {gift.length > 1 && (
                  <View
                    className={style.delete}
                    onClick={() => deleteItem(index, "gift")}
                  >
                    删除赠品
                  </View>
                )}
              </View>
            );
          })}
          <View
            className={style.addButton}
            onClick={() => {
              gift.push({ name: "", num: 0 });
              updateState("gift");
            }}
          >
            添加赠品
          </View>
        </View>
        <View className={style.verification}>店员验证</View>
        <AtInput
          maxLength={11}
          name="cellphone"
          title="* 手机号"
          type="number"
          placeholder="请输入手机号"
          value={data.cellphone}
          onChange={e => update(e, "cellphone")}
        />
        <AtInput
          maxLength={6}
          name="code"
          type="number"
          title="* 验证码"
          placeholder="请输入验证码"
          value={data.code}
          onChange={e => update(e, "code")}
        >
          <View onClick={subCode} style={{ opacity: getCode ? 1 : 0.3 }}>
            获取验证码
          </View>
        </AtInput>
        <View className={style.imgBox}>
          <View className={style.text}>* 购买凭证（付款截图）：</View>
          <View className={style.imgList}>
            {data.imgList.map((item, index) => {
              return (
                <View key={item} className={style.item}>
                  <View
                    className={style.deleteImg}
                    onClick={() => {
                      data.imgList.splice(index, 1);
                      update(data.imgList, "imgList");
                    }}
                  >
                    删除
                  </View>
                  <Image
                    src={item}
                    onClick={() => {
                      Taro.previewImage({
                        urls: [item]
                      });
                    }}
                    className={style.img}
                  />
                </View>
              );
            })}
            <View className={style.item} onClick={selectImg}>
              <AtIcon value="add" />
            </View>
          </View>
        </View>
        <AtButton type="primary" onClick={subForm}>
          提交
        </AtButton>
      </View>
    </View>
  );
}

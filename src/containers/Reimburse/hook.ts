import Taro, { useState, useEffect } from "@tarojs/taro";
import { getRegisterCode, subReimburseForm } from "../../dataFactory";
import { uploadFileArray } from "../../utils";

export function useReimburse(props) {
  const { activity, store } = props;
  const [getCode, setGetCode] = useState(true);
  const [data, setData] = useState({
    cellphone: "",
    code: "",
    imgList: []
  });

  const update = (value, type) => {
    data[type] = value;
    setData(data);
  };

  const [product, setProduct] = useState([{ name: "", num: 0 }]);
  const [gift, setGift] = useState([{ name: "", num: 0 }]);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "报销提交"
    });
    Taro.showModal({
      title: "报销提示",
      content: "由于短信验证码有限制要求，建议当天营业结束后再提交报销",
      showCancel: false
    });
  }, []);

  const updateState = type => {
    type === "product"
      ? setProduct(JSON.parse(JSON.stringify(product)))
      : setGift(JSON.parse(JSON.stringify(gift)));
  };

  const selectImg = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: res => {
        (data.imgList as any).push(res.tempFilePaths[0]);
        update(data.imgList, "imgList");
      }
    });
  };

  const subCode = async () => {
    if (!getCode) {
      Taro.showToast({
        title: "60秒只能发送一次",
        icon: "none"
      });
      return;
    }
    if (data.cellphone.length >= 11 && getCode) {
      const res: any = await getRegisterCode(data.cellphone);
      if (res && !res.code) {
        setGetCode(false);
        setTimeout(() => {
          setGetCode(true);
        }, 60000);
        Taro.showToast({
          title: "发送成功"
        });
      }
    } else {
      Taro.showToast({
        title: "请输入完整手机号",
        icon: "none"
      });
    }
  };

  const deleteItem = (index, type) => {
    if (type === "gift") {
      gift.splice(index, 1);
    } else {
      product.splice(index, 1);
    }
    updateState(type);
  };

  const subForm = async () => {
    Taro.showLoading({
      title: "提交中",
      mask: true
    });
    const giftEx = gift.some(item => !item.name || item.num === 0);
    const productEx = product.some(item => !item.name || item.num === 0);
    if (giftEx || productEx) {
      Taro.hideLoading();
      Taro.showModal({
        showCancel: false,
        title: "商品或赠品信息不完整",
        content: "请确认购买商品与赠品的数量与名称填写完整"
      });
    } else if (
      data.cellphone.length > 10 &&
      data.code.length > 5 &&
      data.imgList.length > 0
    ) {
      const images = await uploadFileArray(data.imgList);
      const res: any = await subReimburseForm({
        ...data,
        images,
        activity,
        product,
        gift,
        store
      });
      if (!res.code) {
        Taro.hideLoading();
        Taro.showModal({
          showCancel: false,
          title: "提交成功",
          content: "报销单审核通过后将以短信形式通知您",
          complete: () => {
            Taro.navigateBack({
              delta: 1
            });
          }
        });
      }
    } else {
      Taro.showToast({
        icon: "none",
        title: "请填写完整信息"
      });
    }
  };

  return {
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
  };
}

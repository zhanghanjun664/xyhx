import Taro, { useEffect, useState } from "@tarojs/taro";
import { getAgentList } from "../../dataFactory";
import { useStore, userInfo } from "../../store";

export const defaultData = {
  agent: null,
  city: [],
  imgList: [],
  addressInfo: "",
  shopName: "",
  latitude: 0,
  longitude: 0,
  openTime: "",
  closeTime: "",
  shopType: null
};

export const useRegister = () => {
  const userData = useStore(userInfo);
  const [agentList, setAgentList] = useState([]);
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "注册"
    });
    initAgentList();
  }, []);

  // 初始化列表
  const initAgentList = async () => {
    const res: any = await getAgentList();
    setAgentList(res.data);
  };

  const [currentId, setCurrentId] = useState(1);
  const [data, setData] = useState({
    headPerson: "",
    code: "",
    userName: "",
    userPassword: "",
    shopList: [JSON.parse(JSON.stringify(defaultData))]
  });

  const update = ({ type, value, index = 0 }) => {
    if (type === "addImgList") {
      (data.shopList[index].imgList as any).push(value);
    } else if (/headPerson|code|userName|userPassword/.test(type)) {
      data[type] = value;
    } else {
      data.shopList[index][type] = value;
    }
    setData(data);
  };

//   userName	string	是	账号
// userPassword	string	是	密码
// headPerson	string	是	负责人
// phone	string	是	电话
// shopList	array	是	门店对象数组
// agentId	int	是	代理商ID
// shopName	string	是	门店名称
// shopPhone	string	是	门店电话
// shopType	int	是	门店类型0：授权店，1：专卖店
// openTime	string	是	开始营业时间
// closeTime	string	是	结算营业时间
// city	string	是	城市
// province	string	是	省
// area	string	是	区
// addressInfo	string	是	详细地址
// longitude	string	是	经度
// latitude	string	是	纬度
// shopImg1	string	是	店内图片1
// shopImg2	string	是	店内图片2

  // 下一步
  const next = () => {
    const isNext = data.shopList.some(item => {
      console.log("item=>", item)
      if (
        data.headPerson &&
        item.addressInfo &&
        item.city.length !== 0 &&
        item.shopName &&
        item.agentId &&
        item.imgList.length > 1 &&
        item.shopType &&
        item.openTime &&
        item.closeTime && 
        item.latitude &&
        item.longitude
        
      ) {
        return true;
      }
    });
    if (isNext) {
      setCurrentId(2);
    } else {
      Taro.showModal({
        showCancel: false,
        title: "信息不全",
        content:
          "请确认信息填写完整（注意检查照片是否为两张）门店地址以及坐标是否已填入"
      });
    }
  };

  return {
    currentId,
    next,
    update,
    data,
    agentList,
    setData,
    userData
  };
};

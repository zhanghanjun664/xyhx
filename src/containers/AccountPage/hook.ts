import Taro, { useState, useEffect } from "@tarojs/taro";
import { updateUserInfo, userInfo, useStore } from "../../store";
import { updateInfo, addSaveStore, getAccountInfo } from "../../dataFactory";
import AV from "leancloud-storage/dist/av-weapp-min.js";

import { uploadFiles } from "../../utils";

export default function useAccount(props) {
  // const { point } = props;
  const userData = useStore(userInfo);
  const [data, setData] = useState({
    ...props,
   
  });


  // 构造以前的数据结构
  if(!Array.isArray(data.city)){
    const city = [data.province, data.city, data.area]
    data.city = city
    delete data.province
    delete data.area
  }



  console.log("Data=>", JSON.parse(JSON.stringify(data)))

  const update = (value, type) => {
    if (type === "addImgList") {
      // data.attachments.push({ url: value });
      data.attachments.push(value);
    } else {
      data[type] = value;
    }
    console.log(JSON.parse(JSON.stringify(data)))
    setData(data);
  };

  const saveInfo = async () => {
    console.log("submit==>", JSON.parse(JSON.stringify(data)))
    console.log("(data.affiliation && data.affiliation.agentId || data.agentId)=>", Boolean(data.shopType === 0 || data.shopType))
    if (
      data.addressInfo &&
      data.shopName &&
      data.city.length !== 0 &&
      (data.shopType === 0 || data.shopType) &&
      (data.affiliation && data.affiliation.agentId || data.agentId)&&
      data.attachments.length === 2 &&
      data.openTime &&
      data.closeTime &&
      data.latitude !== 0 &&
      data.longitude !== 0
    ) {
      Taro.showLoading({ title: "保存中" });
      const list = await uploadFileArray(data.attachments);
      const params = {
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        addressInfo: data.addressInfo,

        province: data.city[0],
        city: data.city[1],
        area: data.city[2],
        
        // image: list,
        shopImg1: list[0],
        shopImg2: list[1],

        userId: userData.userId,
        shopName: data.shopName,
        openTime: data.openTime,
        closeTime: data.closeTime,
        shopType: data.shopType,
        agentId: (data.affiliation && data.affiliation.agentId || data.agentId),
        shopPhone: "",
        shopId: data.shopId
      };

      // 修改门店
      if(params.shopId){
        const res: any = await updateInfo(params);
        updateUserInfo(res.data);
        Taro.showToast({
          title: "更新成功"
        });
        

      } else{
        // 新增门店
        const { data: storeData }: any = await addSaveStore(params);
        console.log("storeData=>", storeData)
        // data.objectId = storeData.objectId;
        setData(data);
        const res: any = await getAccountInfo();
        Taro.hideLoading();
        updateUserInfo(res.data);
        Taro.showModal({
          title: "提交成功",
          showCancel: false,
          content: "审核通过后将短信通知到您到手机"
        });

      }
      
    } else {
      Taro.showToast({
        icon: "none",
        title: "信息不全"
      });
    }
  }
  return { data, update, saveInfo, setData };
}

//   const saveInfo = async () => {
//     if (data.new && userData.isSupplement) {
//       if (
//         data.addressInfo &&
//         data.shopName &&
//         data.city.length !== 0 &&
//         data.shopType &&
//         data.attachments.length === 2 &&
//         data.openTime &&
//         data.closeTime &&
//         data.latitude !== 0 &&
//         data.longitude !== 0
//       ) {
//         Taro.showLoading({ title: "保存中" });
//         const list = await uploadFileArray(data.attachments);
//         const params = {
//           point: {
//             latitude: data.latitude,
//             longitude: data.longitude
//           },
//           addressInfo: data.addressInfo,
//           city: data.city,
//           image: list,
//           affiliation: data.affiliation.objectId,
//           userId: userData.userId,
//           shopName: data.shopName,
//           salesTime: [data.openTime, data.closeTime],
//           shopType: userData.shopType
//         };
//         const { data: storeData }: any = await addSaveStore(params);
//         data.objectId = storeData.objectId;
//         data.new = false;
//         setData(data);
//         const res: any = await getAccountInfo();
//         Taro.hideLoading();
//         updateUserInfo(res.data);
//         Taro.showModal({
//           title: "提交成功",
//           showCancel: false,
//           content: "审核通过后将短信通知到您到手机"
//         });
//       } else {
//         Taro.showToast({
//           icon: "none",
//           title: "信息不全"
//         });
//       }
//     } else {
//       if (
//         data.shopName &&
//         data.addressInfo &&
//         data.openTime &&
//         data.closeTime &&
//         data.attachments.length === 2
//       ) {
//         Taro.showLoading({
//           title: "更新中"
//         });
//         const list = await uploadFileArray(data.attachments);
//         update(list, "image");
//         const res: any = await updateInfo({
//           ...data,
//           image: list,
//           affiliation: data.affiliation.objectId,
//           point: { latitude: data.latitude, longitude: data.longitude },
//           type: !userData.isSupplement ? "supplement" : "updateStore",
//           salesTime: [data.openTime, data.closeTime],
//           storeId: data.objectId
//         });
//         if (!res.code) {
//           updateUserInfo(res.data);
//           Taro.showToast({
//             title: "更新成功"
//           });
//         }
//       } else {
//         Taro.showToast({
//           icon: "none",
//           title: "请填写所有内容"
//         });
//       }
//     }
//   };
//   return { data, update, saveInfo, setData };
// }

// 上传数组图片
export const uploadFileArray = async list => {
  console.log("list==>", list)
  // http://q1xitsrn6
  // const newList: any = [];
  if(list[0].indexOf("http://tmp/") == -1){
    return list
  }

  return uploadFiles(list)


  // return new Promise((resolve, reject) => {
  //   list.map(item => {
  //     // if (item.objectId) {
  //     //   newList.push(item.objectId);
  //     //   if (newList.length === list.length) {
  //     //     resolve(newList);
  //     //   }
  //     //   return;
  //     // }
  //     new AV.File("file-name", {
  //       blob: { uri: item }
  //     })
  //       // 上传
  //       .save()
  //       // 上传成功
  //       .then(file => {
  //         const url = file.id;
  //         newList.push(url);
  //         if (newList.length === list.length) {
  //           resolve(newList);
  //         }
  //       })
  //       // 上传发生异常
  //       .catch(console.error);
  //   });
  // });
};

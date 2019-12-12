import Taro, { clearStorage } from "@tarojs/taro";
import { getActivityList, getAccountActivityList, getUserEndActivity } from "../dataFactory";
import { updateActivityData } from "../store";
import AV from "leancloud-storage/dist/av-weapp-min.js";
import { any } from "prop-types";

export const transformTime = (time = new Date(), all = false) => {
  let current = "";
  const date = new Date(time);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  if (all) {
    current = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    current = `${year}-${month}-${day}`;
  }

  return current;
};

export function convertDate(iso) {
  return new Date([new Date(iso).toUTCString()].join(""));
}

export const transformActivity = data => {
  let activeStatus = "";
  let activityStatus = "";
  let activityTime = "";
  const time = +new Date();
  // 报名截止
  const bmjz = +convertDate(data.bmjz);
  // 活动开始
  const hdks = +convertDate(data.hdks);
  // 活动结束
  const hdjs = +convertDate(data.hdjs);
  // 报销开始
  const bxks = +convertDate(data.bxks);
  // 报销截止
  const bxjz = +convertDate(data.bxjz);

  // 报名开始
  if (time < bmjz) {
    activeStatus = "可报名";
    activityTime = data.bmjz;
    activityStatus = "报名截止";
  }
  // 活动开始
  if (time < hdks) {
    activeStatus =
      data.status === 3 ? "可报名" : data.status === 2 ? "待开始" : "审核中";
    activityTime = data.hdks;
    activityStatus = "活动开始于";
  }
  // 进行中
  if (time > hdks && time < hdjs) {
    activeStatus = "进行中";
    activityTime = data.hdjs;
    activityStatus = "活动截止于";
  }
  // 报销中
  if (time > bxks) {
    activeStatus = "报销中";
    activityTime = data.bxjz;
    activityStatus = "报销截止于";
  }
  // 活动结束
  if (time > hdjs) {
    if (time < bxjz) {
      activeStatus = "报销中";
      activityTime = data.bxjz;
      activityStatus = "报销截止于";
    } else {
      activeStatus = "已结束";
      activityTime = data.hdjs;
      activityStatus = "活动截止于";
    }
  }

  return { activeStatus, activityStatus, activityTime };
};

// 更新列表
export const updateActivityList = async (typeIndex, userId) => {

  let res;
  // 已结束
  if(typeIndex == 3){
    res = await getUserEndActivity({
      userid: userId
    });
  } else {
    res = await getActivityList({
      status: typeIndex,
      userid: userId
    });
    let atList = [];
    // 活动报名
    if(typeIndex == 1){
      atList = (res.data || []).filter(item => !item.shopList)
    } else {
      atList = (res.data || []).filter(item => item.shopList)
    }
  
    res.data = atList


  }


  if(res && res.code == "10000"){
    if(typeIndex ==3){
      updateActivityData({ activityList: res.data.data || [] });
    } else {
      updateActivityData({ activityList: res.data });
    }
  }
  Taro.hideLoading();

  // 活动列表
  // const accountList: any = await getAccountActivityList();
  // Taro.hideLoading();
  // if (res && !res.code) {
  //   res.data.map(item => {
  //     if (item.hdjs) {
  //       Object.assign(item, transformActivity(item));
  //       (accountList.data || []).map(i => {
  //         if (item.objectId === i.activity.objectId) {
  //           Object.assign(item, {
  //             status: i.status,
  //             activity: i.objectId,
  //             store: i.store
  //           });
  //           Object.assign(item, {
  //             ...transformActivity(item)
  //           });
  //         }
  //       });
  //     }
  //   });
  //   updateActivityData({ activityList: res.data });
  // }
};

// 上传数组图片
export const uploadFileArray = async list => {
  const newList: any = [];
  return new Promise((resolve, reject) => {
    list.map(item => {
      new AV.File("file-name", {
        blob: { uri: item }
      })
        // 上传
        .save()
        // 上传成功
        .then(file => {
          const url = file.id;
          newList.push(url);
          if (newList.length === list.length) {
            resolve(newList);
          }
        })
        // 上传发生异常
        .catch(console.error);
    });
  });
};

const uploadFile = (url) => {
  let promise = new Promise((resolve, reject)=>{
    var tmpUrl = url

    const domain = "http://api.yhdawang.top/vcapp/"
  
    Taro.uploadFile({
      url: `${domain}activity/uploadImg`,
      filePath: tmpUrl,
      name: 'img',
      formData: {
      },
  
      success: function (data) {
        console.log('上传成功：', data);

        let res = JSON.parse(data.data)
        if(res.data){
          resolve(res.data)
        }else{
          reject(res)
        }
      },
      fail: function (data) {
        console.log('上传失败',data);
        reject(data)
        // wx.hideToast()
      }
  
    })
   

  })
  return promise

}

export const uploadFiles = (fileList) => {
  let uploadList = []
  for(let i=0;i<fileList.length;i++){
    uploadList.push(uploadFile(fileList[i]))
  }

  return Promise.all(uploadList)
  
  
}
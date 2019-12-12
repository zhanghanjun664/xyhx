import Taro, { useState, useEffect } from "@tarojs/taro";
import { joinActivity, getAccountActivityList, getUserShop } from "../../dataFactory";
import { useStore, activityData, userInfo } from "../../store";
import { updateActivityList, convertDate } from "../../utils";

export const useActivity = props => {
  const { userId, shopList } = useStore(userInfo);
  const { activityList } = useStore(activityData);
  const { activitysId } = props;
  const [info] = useState(activityList.filter(o => o.activitysId === activitysId)[0]);
  const [checkedList, setCheckedList] = useState();
  const [checkboxOption, setCheckboxOption] = useState([]);
  const [accountList, setAccountList] = useState();
  console.log("info=>", info)
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: info.activityName
    });
    initData();
  }, []);

  const initData = async () => {
    const list: any = [];
    const time = +new Date();
    const signEndTime = +convertDate(info.signEndTime);
    const reimbEndTime = +convertDate(info.reimbEndTime);
    const reimbStartTime = +convertDate(info.reimbStartTime);

    // const res: any = await getAccountActivityList({userid: userId});
    // setAccountList(res.data);

    // const res: any = await getUserShop({userid: userId});    

    (shopList || []).map(it=>{
      let disabled = false;
      // 返回true说明门店已报名
      let bol = (info.shopList || []).some(item => item == it.shopId)
      // 报销期
      if(time > reimbStartTime && time < reimbEndTime){
        console.log("报销期")
        // 已报名的门店可报销
        if(bol){
          disabled = false
        } else{
          disabled = true
        }
        console.log(disabled)

      } else if(time < signEndTime){
        console.log("报名期")
        // 报名期
        // 已参加，不能再参加
        if(bol){
          disabled = true
        } else {
          disabled = false
        }

      }

      list.push({
        label: it.shopName,
        value: it.shopId,
        disabled
      })

    })

    setCheckboxOption(list);


    // stores.map(item => {
    //   res.data.forEach(obj => {
    //     if (time > reimbStartTime && time < reimbEndTime) {
    //       // 报销
    //       if (obj.store.activitysId === item.activitysId) {
    //         const title =
    //           obj.status === 3
    //             ? "（未通过审核）"
    //             : obj.status === 2
    //             ? "（可报销）"
    //             : "（审核中）";
    //         const disabled = obj.status !== 2;
    //         list.push({
    //           value: item.activitysId,
    //           label: `${item.storeName}${title}`,
    //           disabled,
    //           status: item.status
    //         });
    //       }
    //     } else if (time < signEndTime) {
    //       // 报名
    //       let title =
    //         item.status === 3
    //           ? "（门店未通过审核）"
    //           : item.status === 2
    //           ? "（门店可报名）"
    //           : "（门店审核中）";
    //       let disabled = item.status !== 2;
    //       if (obj.store.activitysId === item.activitysId) {
    //         title =
    //           obj.status === 3
    //             ? "（报名未通过审核）"
    //             : obj.status === 2
    //             ? "（可报名）"
    //             : "（审核中）";
    //       }
    //       list.push({
    //         value: item.activitysId,
    //         label: `${item.storeName}${title}`,
    //         disabled,
    //         status: item.status
    //       });
    //     }
    //   });
    // });



    // setCheckboxOption(list);
  };

  // 点击报名
  const signUp = async () => {
    if(!checkedList) return
    await checkedList.forEach(async item => {
      const res: any = await joinActivity({ activityid: activitysId, shopid: item });
      if (res && res.code == "10000") {
        Taro.showToast({
          title: "已提交报名"
        });
      } else {
        Taro.showToast({
          title: "提交异常",
          icon: "none"
        });
      }
    });
    updateActivityList(1, userId);
  };

  const reimburse = shopid => {
    console.log("shopid=>", shopid)
    let activity = "";
    // accountList.some(item => {
    //   if (item.store.activitysId === store) {
    //     activity = item.activitysId;
    //     return true;
    //   }
    // });
    Taro.navigateTo({
      url: `/containers/Reimburse/index?activitysId=${activitysId}&shopid=${shopid}`
    });
  };

  let text = "";
  let showSignUp = false;
  let showReimburse = false;

  if (info) {
    const time = +new Date();
    const signEndTime = +convertDate(info.signEndTime);
    const activityStartTime = +convertDate(info.activityStartTime);
    const activityEndTime = +convertDate(info.activityEndTime);
    const reimbStartTime = +convertDate(info.reimbStartTime);
    const reimbEndTime = +convertDate(info.reimbEndTime);
    if (time < signEndTime) {
      text = "报名进行中";
      showSignUp = true;
    }
    if (time < activityStartTime) {
      text = "报名截止，报名成功的门店请等待活动开始";
    } else if (time < activityEndTime) {
      text = "活动进行中，报销开始时报名成功的门店可在下方进行报销提交";
    }
    if (time > reimbStartTime && time < reimbEndTime) {
      text = "报销活动进行中，报名成功的门店可在下方进行报销提交";
      showReimburse = true;
    }
  }

  return {
    info,
    text,
    showReimburse,
    showSignUp,
    reimburse,
    signUp,
    checkboxOption,
    checkedList,
    setCheckedList
  };
};

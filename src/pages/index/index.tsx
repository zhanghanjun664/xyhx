import Taro, { Component, Config } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Content from "./content";

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: "首页"
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: "小野活动报名报销系统"
    });
    Taro.showShareMenu({
      withShareTicket: true
    });
  }

  render() {
    return (
      <View className="index">
        <Content />
      </View>
    );
  }
}

import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Content from "./content";

export default class Index extends Component<any, any> {
  render() {
    return (
      <View>
        <Content {...this.$router.params} />
      </View>
    );
  }
}

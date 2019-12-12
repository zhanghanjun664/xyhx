import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Content from "./content";

export default class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      Update: false
    };
  }

  onPullDownRefresh() {
    this.setState({
      Update: true
    });
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 200);
  }

  updateUpdate = () => {
    this.setState({ Update: false });
  };

  render() {
    const { Update } = this.state;

    return ( 
      <View>
        <Content status={Update} updateUpdate={this.updateUpdate} />
      </View>
    );
  }
}

Index.config = {
  enablePullDownRefresh: true,
  onReachBottomDistance: 50
};

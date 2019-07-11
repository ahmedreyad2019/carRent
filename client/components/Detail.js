import { View, Text } from "react-native";
import React, { Component } from "react";
import AppText from "./AppText";
class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          height: 40,
          borderBottomWidth: 0.4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomColor: "#eeeeee"
        }}
      >
        <AppText fontStyle={"bold"} text={this.props.field} />
        <AppText  text={this.props.data} />
      </View>
    );
  }
}

export default Detail;

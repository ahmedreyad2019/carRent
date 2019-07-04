import { View, Text } from "react-native";
import React, { Component } from "react";
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
        <Text style={{ fontFamily: "AvenirNext-Bold" }}>
          {this.props.field}
        </Text>
        <Text>{this.props.data}</Text>
      </View>
    );
  }
}

export default Detail;

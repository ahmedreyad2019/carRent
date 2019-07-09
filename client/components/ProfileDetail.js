import React, { Component } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, View, Platform } from "react-native";
import { styles, colors } from "../styles";
class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          backgroundColor: "white",
          justifyContent: "space-between",
          borderBottomColor: "#cccccc",
          borderBottomWidth: 0.5,
          padding: 20
        }}
      >
        <Ionicons
          name={
            (Platform.OS === "ios" ? "ios" : "android") + "-" + this.props.icon
          }
          style={{ flex: 0.1 }}
          size={20}
          color={colors.primary}
        />
        <TextInput
          style={{
            fontSize: 16,
            color: "#888888",
            borderBottomColor: "#cccccc",
            fontFamily: Platform.OS === "ios" ? "Avenir-Light" : "Roboto",
            flex: 0.9,
          }}
          value={this.props.text}
          editable={this.props.editable}
        />
      </View>
    );
  }
}

export default ProfileDetail;

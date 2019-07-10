import React, { Component } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput, View, Platform } from "react-native";
import { styles, colors } from "../styles";
import AppText from "./AppText";
class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderTopWidth: this.props.top ? 0.5 : 0,
          borderTopColor: "#dedede",
          borderBottomWidth: 0.5,
          borderBottomColor: "#dedede"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <Ionicons
            name={Platform.OS + "-" + this.props.icon}
            size={20}
            style={{ marginRight: 15 }}
          />

          <AppText text={this.props.title} size={15} />
        </View>
        <TextInput
          editable={this.props.editable}
          keyboardType={this.props.keyboardType}
          value={this.props.value}
        />
      </View>
    );
  }
}

export default ProfileDetail;

import React, { Component } from "react";
import { Text } from "react-native";
class AppText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getFont = font => {
    switch (font) {
      case "italic":
        return "AvenirNext-BoldItalic";
      case "bold":
        return "AvenirNext-Bold";
      case "light":
        return "Avenir-Light";
      default:
        return "AvenirNext-DemiBold";
    }
  };
  render() {
    return (
      <Text
        style={{
          ...this.props.style,
          fontSize: this.props.size,
          fontFamily: this.getFont(this.props.fontStyle)
        }}
      >{this.props.text}</Text>
    );
  }
}

export default AppText;

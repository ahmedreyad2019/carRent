import React, { Component } from "react";
import { Text } from "react-native";
import {Platform} from 'react-native'
class AppText extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getFont = font => {
    switch (font) {
      case "italic":
        return Platform.OS==='ios'?"AvenirNext-BoldItalic":"Roboto";
      case "bold":
        return Platform.OS==='ios'?"AvenirNext-Bold":"Roboto";
      case "light":
        return Platform.OS==='ios'?"Avenir-Light":"Roboto";
      default:
        return Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto";
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

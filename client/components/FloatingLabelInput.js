import React, { Component } from "react";
import {
  View,
  Text,
  Easing,
  TextInput,
  Animated,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

class FloatingLabelInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      passwordVisible: false,
      icon: "ios-eye-off"
    };
  }
  componentWillMount = () => {
    this._animatedIsFocused = new Animated.Value(0);
  };
  componentDidUpdate = () => {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
      duration: 200,
      easing: Easing.linear
    }).start();
  };
  handleFocus = () => {
    this.setState({ isFocused: true });
  };
  handleBlur = () => {
    this.setState({ isFocused: false });
  };
  handlePassword = () => {
    console.log(this.state.passwordVisible);
    this.setState(prevState => ({
      ...prevState,
      passwordVisible: !prevState.passwordVisible,
      icon: prevState.icon === "ios-eye" ? "ios-eye-off" : "ios-eye"
    }));
  };
  render() {
    const { label, ...props } = this.props;
    const { isFocused } = this.state;
    const labelStyle = {
      position: "absolute",
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0]
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 16]
      }),
      color: "#74808E"
    };
    const icon = {
      position: "absolute",
      right: 0,
      top: 30,
      color: "#74808E"
    };
    return (
      <>
        <View style={{ paddingTop: 15 }}>
          <Animated.Text style={labelStyle}>{label}</Animated.Text>
          <TextInput
            {...props}
            spellCheck={false}
            returnKeyType={"next"}
            secureTextEntry={
              !this.state.passwordVisible &&
              this.props.textContentType === "password"
            }
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {props.textContentType === "password" ? (
            <TouchableOpacity
              onPressIn={this.handlePassword}
              onPressOut={this.handlePassword}
              style={icon}
            >
              <Ionicons name={this.state.icon} size={20} color={"#74808E"} />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </>
    );
  }
}

export default FloatingLabelInput;

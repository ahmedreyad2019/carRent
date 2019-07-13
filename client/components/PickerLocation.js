import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Animated,
  Easing,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from "../actions/index";
import { styles, colors } from "../styles";
import { connect } from "react-redux";

class PickerLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      selected: "Nasr City",
      listItems: [
        "Nasr City",
        "5th Settlement",
        "3rd Settlement",
        "1st Settlement",
        "6th October",
        "Maadi",
        "Ramsis",
        "Sheikh Zayed",
        "Zamalek",
        "Mohandeseen",
        "Helioplis",
        "Dokki"
      ]
    };
  }
  componentWillMount = () => {
    this._animatedIsFocused = new Animated.Value(0);
    this.setState(prevState => ({
      ...prevState,
      listItems: prevState.listItems.sort((a, b) => {
        return a.localeCompare(b);
      }),
      selected: prevState.listItems[0]
    }));
  };
  componentDidUpdate = () => {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.listOpen ? 1 : 0,
      duration: 100,
      easing: Easing.linear
    }).start();
  };
  render() {
    const labelStyle = {
      height: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [0, this.props.height ? this.props.height : 300]
      }),
      width: "100%",

      zIndex: 5000000000000,
      borderColor: "#eee",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20
    };
    return (
      <View
        style={{
          width: 200,
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 1223423423424242424
        }}
      >
        <TouchableOpacity activeOpacity={1}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            this.setState(prevState => ({
              listOpen: !prevState.listOpen
            }));
          }}
        >
          <View
            style={{
              backgroundColor: colors.primary,
              width: 200,
              flexDirection: "row",
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              justifyContent: "space-evenly",
              zIndex: 1223423423424242424
            }}
          >
            <Text
              style={{
                fontFamily:
                  Platform.OS === "ios" ? "AvenirNext-DemiBold" : "Roboto",
                color: "white",
                fontSize: 16
              }}
            >
              {this.props.search.location}
            </Text>
            <Ionicons
              name={"ios-arrow-down"}
              size={20}
              color={"white"}
              style={{
                position: "absolute",

                right: 10
              }}
            />
          </View>
        </TouchableOpacity>
        <Animated.View style={labelStyle}>
          <ScrollView
            style={{
              flex: 1,
              flexDirection: "column",
              width: "100%",
              paddingHorizontal: 10,
              zIndex: 1223423423424242424
            }}
            contentContainerStyle={{ alignItems: "flex-start", flexGrow: 1 }}
          >
            {this.state.listItems.map((item, i) => (
              <TouchableOpacity
                hitSlop={{ top: 10 }}
                onPress={() => {
                  this.setState(prevState => ({
                    listOpen: !prevState.listOpen
                  }));
                  this.props.doSetLocation(item);
                }}
                key={i}
                style={{
                  width: "100%",
                  marginVertical: 8,
                  borderBottomColor: "#223344",
                  borderBottomWidth: 1,
                  zIndex: 28713868126386816238681623
                }}
              >
                <Text
                  style={{
                    fontFamily:
                      Platform.OS === "ios" ? "AvenirNext-DemiBold" : "Roboto",
                    fontSize: 16,
                    color: "white"
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    search: state.carReducer.search
  };
};

const mapDispatchToProps = dispatch => ({
  doSetLocation: location => {
    dispatch(actions.setRentingLocation(location));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PickerLocation);

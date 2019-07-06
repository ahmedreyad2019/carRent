import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing
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
        "1st Settlement",
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
        outputRange: [0, 200]
      }),
      width: "150%",
      zIndex: 5000000000000,
      borderWidth: 1,
      borderColor: "#eee",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      backgroundColor: "white"
    };
    return (
      <View
        style={{
          width: 150,
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            width: 150,
            flexDirection: "row",
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            justifyContent: "space-evenly"
          }}
          onPress={() =>
            this.setState(prevState => ({ listOpen: !prevState.listOpen }))
          }
        >
          <Text style={{ fontFamily: "AvenirNext-DemiBold", color: "white" }}>
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
            onPress={() =>
              this.setState(prevState => ({ listOpen: !prevState.listOpen }))
            }
          />
        </TouchableOpacity>
        <Animated.View style={labelStyle}>
          <ScrollView
            style={{
              flexDirection: "column",
              width: "100%",paddingTop:15
            }}
            contentContainerStyle={{ alignItems: "flex-start" }}
          >
            {this.state.listItems.map((item, i) => (
              <TouchableOpacity
                onPress={() => {
                  this.setState(prevState => ({
                    listOpen: !prevState.listOpen
                  }));
                  this.props.doSetLocation(item);
                }}
                key={i}
                style={{
                  borderBottomWidth: 0.4,
                  width: "100%",
                  marginBottom: 15,
                  borderBottomColor: "#eee"
                }}
              >
                <Text
                  style={{
                    fontFamily: "AvenirNext-DemiBold",
                    fontSize: 18,
                    color: "black"
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
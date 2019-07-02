import { connect } from "react-redux";
import React from "react";
import {
  View,
  PickerIOS,
  Easing,
  TouchableOpacity,
  Animated
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import * as actions from "../actions/index";
var PickerItemIOS = PickerIOS.Item;
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconName: "ios-arrow-up",
      order: "asc",
      keys: [],
      selectedKey: ""
    };
    this.RotateValueHolder = new Animated.Value(
      this.props.order === "asc" ? 0 : 1
    );
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(this.props.order === "asc" ? 0 : 1);

    Animated.spring(this.RotateValueHolder, {
      toValue: this.props.order === "asc" ? 1 : 0,
      friction: 5
    }).start();
  }

  handlePassword = () => {
    this.props.doSetOrder();
    this.handleSort();
    this.StartImageRotateFunction();
  };
  handleAttributes = () => {
    const { cars } = this.props;
    this.setState({
      keys: Object.keys(cars[0]),
      selectedKey: Object.keys(cars[0])[0]
    });
    this.handleSort();
  };
  handleSort = () => {
    this.props.doSetCars(
      this.props.cars.sort(
        this.compare(this.state.selectedKey, this.props.order)
      )
    );
  };
  componentDidUpdate() {}

  onValueChange = selectedKey => {
    if (selectedKey) this.setState({ selectedKey: selectedKey });
  };

  componentDidMount = () => {
    this.handleAttributes();
  };
  compare = (key, order = "asc") => {
    return function(item1, item2) {
      if (!item1.hasOwnProperty(key) || !item2.hasOwnProperty(key)) {
        return 0;
      }
      let att1 =
        typeof item1[key] === "string" ? item1[key].toUpperCase() : item1[key];
      let att2 =
        typeof item2[key] === "string" ? item2[key].toUpperCase() : item2[key];
      let comp = 0;
      if (att1 > att2) comp = 1;
      else if (att2 > att1) comp = -1;
      return order == "desc" ? comp * -1 : comp;
    };
  };

  render() {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "180deg"]
    });

    const labelStyle = {
      position: "absolute",
      top: 0,
      left: 15,
      transform: [{ rotate: RotateData }]
    };
    return (
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
        <View
          style={{
            ...styles.CompanyDetails,
            padding: 0,
            height: "80%",
            position: "absolute",
            bottom: 0
          }}
        >
          <View
            style={{
              height: 40,
              borderBottomWidth: 0.3,
              borderBottomColor: "#74808E"
            }}
          />
          <Animated.View style={labelStyle}>
            <Ionicons
              size={40}
              color={"#74808E"}
              name={this.state.iconName}
              onPress={this.handlePassword}
            />
          </Animated.View>
          <PickerIOS
            itemStyle={{ color: "black" }}
            selectedValue={this.state.selectedKey}
            onValueChange={this.onValueChange}
          >
            {this.state.keys.map((keySelection, i) => (
              <PickerItemIOS
                key={i}
                value={keySelection}
                label={keySelection}
              />
            ))}
          </PickerIOS>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 15
            }}
            onPress={() => {
              this.props.doCloseFilterModal();
            }}
          >
            <Ionicons name={"ios-close"} size={40} color={"#F08080"} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.loginReducer.token,
    cars: state.carReducer.cars,
    loading: state.loginReducer.loading,
    selectedCar: state.carReducer.selectedCar,
    order: state.carReducer.order
  };
};

const mapDispatchToProps = dispatch => ({
  doCloseFilterModal: () => {
    dispatch(actions.closeFilterModal());
  },
  doSetOrder: () => {
    dispatch(actions.setOrder());
  },
  doSetCars: car => {
    dispatch(actions.setCars(car));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);

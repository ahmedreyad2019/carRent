import React from "react";
import {
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
  Modal,
  Picker,
  View,
  PanResponder,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import { Header } from "react-native-elements";
import Filter from "../components/Filter";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import DatePicker from "../components/DatePicker";
import PickerLocation from "../components/PickerLocation";
import AppText from "../components/AppText";
import Detail from "../components/Detail";
import FloatingLabelInput from "../components/FloatingLabelInput";
import CarList from "../components/CarList.json";
import DatePickerA from "react-native-datepicker";

class MainScreen extends React.Component {
  componentDidMount = () => {
    this.setState({
      carMakes: Object.values(CarList).map(car => car.title),
      carModels:
        this.props.search.make !== "Any"
          ? Object.values(CarList)
              .filter(car => car.title === this.props.search.make)
              .map(model => model.models)[0]
              .map(model => model.title)
          : []
    });
  };
  componentWillMount = () => {
    this._animatedValueX = 0;
    this._animatedValueY = 0;
    this.state.pan.x.addListener(value => (this._animatedValueX = value.value));
    this.state.pan.y.addListener(value => (this._animatedValueY = value.value));

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    
        onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({
          x: this._animatedValueX,
          y: this._animatedValueY
        });
        this.state.pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }])(
          e,
          gestureState
        );
      },
      onPanResponderRelease: () => {
        let ys = this._animatedValueY;
        this.state.pan.flattenOffset();

        Animated.spring(this.state.pan.y, {
          toValue: this.state.s ? 350 : 0,
          friction: 25
        }).start();
        this.setState(prevState => ({
          s: !prevState.s
        }));
      }
    });
  };
  componentWillUnmount = () => {
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
  };
  getStyle = () => {
    return [
      {
        transform: [
          {
            translateY: this.state.pan.y
          }
        ]
      }
    ];
  };
  constructor(props) {
    super(props);
    this.state = {
      investor: null,
      loading: true,
      hi: false,
      refresh: false,
      data: [],
      carMakes: [],
      carModels: [],
      make: "Acura",
      pan: new Animated.ValueXY(),
      s: false
    };
  }

  openModalDate = () => {
    this.setState({ dateModalOpen: true });
  };

  _onRefresh = () => {
    this.props.doFetchCars(this.props.search);
  };
  getdateString = date => {
    var today = new Date(date);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      days[today.getDay()] +
      ", " +
      today.getDate() +
      "/" +
      (today.getMonth() + 1)
    );
  };
  getTimeString = date => {
    var today = new Date(date);
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  render() {
    carModels =
      this.props.search.make !== "Any"
        ? Object.values(CarList)
            .filter(car => car.title === this.props.search.make)
            .map(model => model.models)[0]
            .map(model => model.title)
        : [];
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText
              size={16}
              style={{ color: "white" }}
              text={"Choose Date and Location"}
            />
          }
        />
        <DatePickerA
          ref={component => (this._datepicker = component)}
          mode="date"
          date={
            this.state.source === "From"
              ? this.props.search.rentingDateStart
              : this.props.search.rentingDateEnd
          }
          onDateChange={date =>
            this.state.source === "From"
              ? this.props.doSetRentingDate(
                  date,
                  this.props.search.rentingDateEnd
                )
              : this.props.doSetRentingDate(
                  this.props.search.rentingDateStart,
                  date
                )
          }
          mode="date"
          minDate="2016-05-01"
          hideText={true}
          showIcon={false}
        />

        <Modal
          style={{ alignItems: "flex-end" }}
          transparent={true}
          animationType={"fade"}
          visible={this.props.dateModalVisible}
        >
          <DatePicker
            header={this.state.source}
            date={
              this.state.source === "From"
                ? this.props.search.rentingDateStart
                : this.props.search.rentingDateEnd
            }
            onDateChange={date =>
              this.state.source === "From"
                ? this.props.doSetRentingDate(
                    date,
                    this.props.search.rentingDateEnd
                  )
                : this.props.doSetRentingDate(
                    this.props.search.rentingDateStart,
                    date
                  )
            }
          />
        </Modal>

        <View
          style={{
            shadowRadius: 10,
            shadowOffset: { height: 2 },
            shadowColor: "black",
            shadowOpacity: 0.2,
            elevation: 1
          }}
        >
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 5,
              flexDirection: "column",
              justifyContent: "center",
              alignSelf: "center",
              elevation: 1
            }}
          >
            <View
              style={{
                height: 50,
                flexDirection: "row",
                marginHorizontal: 50,
                paddingTop: 20,
                justifyContent: "space-evenly",
                backgroundColor: colors.backgroundCard,
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
                zIndex: 5000000000000
              }}
            >
              <PickerLocation />
            </View>

            <View
              style={{
                height: 70,
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                backgroundColor: colors.backgroundCard,
                borderRadius: 50
              }}
            >
              <TouchableOpacity
                onPress={() => (
                  Platform.OS === "ios"
                    ? this.props.openDateModal()
                    : this._datepicker.onPressDate(),
                  this.setState({ source: "From" })
                )}
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.primary,
                    fontFamily:
                      Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
                  }}
                >
                  {this.getdateString(this.props.search.rentingDateStart)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary,
                    fontFamily:
                      Platform.OS === "ios" ? "AvenirNext-DemiBold" : "Roboto"
                  }}
                >
                  {this.getTimeString(this.props.search.rentingDateStart)}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderRightColor: "#eeeeee",
                  borderRightWidth: 1,
                  height: "100%"
                }}
              >
                <View
                  style={{
                    borderRadius: 50,
                    borderColor: "#eeeeee",
                    borderWidth: 1,
                    backgroundColor: "white",
                    height: 40,
                    width: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    position: "absolute",
                    right: -20,
                    top: 15
                  }}
                >
                  <Ionicons
                    name={"ios-arrow-round-forward"}
                    size={40}
                    color={"#cccccc"}
                  />
                </View>
              </View>
              <TouchableOpacity
                 onPress={() => (
                  Platform.OS === "ios"
                    ? this.props.openDateModal()
                    : this._datepicker.onPressDate(), this.setState({ source: "To" })
                )}
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.primary,
                    fontFamily:
                      Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
                  }}
                >
                  {this.getdateString(this.props.search.rentingDateEnd)}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.primary,
                    fontFamily:
                      Platform.OS === "ios" ? "AvenirNext-DemiBold" : "Roboto"
                  }}
                >
                  {this.getTimeString(this.props.search.rentingDateEnd)}
                </Text>
              </TouchableOpacity>
            </View>
            <Animated.View
              style={{
                height: this.state.pan.y.interpolate({
                  inputRange: [0, 350],
                  outputRange: [0, 350]
                }),
                paddingTop: 40,
                paddingBottom: 0,
                top: -40,
                zIndex: -1,
                backgroundColor: "white",
                borderBottomLeftRadius: 35,
                borderBottomRightRadius: 35
              }}
            >
              <ScrollView
                style={{
                  width: "100%",
                  height: this.state.pan.y.interpolate({
                    inputRange: [0, 350],
                    outputRange: [0, 350]
                  }),
                  borderBottomLeftRadius: 35,
                  borderBottomRightRadius: 35,
                  flexDirection: "column"
                }}
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <AppText text={"Filter"} size={20} />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: 30
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <AppText text={"Car Make"} />
                    <View style={{ height: 50 }}>
                      <Picker
                        selectedValue={this.props.search.make}
                        style={{ width: 160 }}
                        onValueChange={(itemValue, itemIndex) =>
                          this.props.doSetMakeModel(
                            itemValue,
                            itemValue !== "Any"
                              ? Object.values(CarList)
                                  .filter(car => car.title === itemValue)
                                  .map(model => model.models)[0]
                                  .map(model => model.title)[0]
                              : []
                          )
                        }
                      >
                        {this.state.carMakes.map((item, i) => (
                          <Picker.Item label={item} key={i} value={item} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <AppText text={"Car Model"} />
                    <View style={{ height: 50 }}>
                      <Picker
                        selectedValue={this.props.search.model}
                        style={{ width: 180 }}
                        onValueChange={(itemValue, itemIndex) =>
                          this.props.doSetMakeModel(
                            this.props.search.make,
                            itemValue
                          )
                        }
                      >
                        {carModels.map((item, i) => (
                          <Picker.Item label={item} key={i} value={item} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </Animated.View>
            <Animated.View
              {...this._panResponder.panHandlers}
              style={{ top: -40 }}
            >
              <TouchableWithoutFeedback
                onPress={() => (
                  this.props.navigation.navigate("Cars"),
                  this.props.doFetchCars(this.props.search)
                )}
              >
                <View
                  style={{
                    height: 40,
                    flexDirection: "column",
                    marginHorizontal: 100,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    backgroundColor: colors.primary,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily:
                        Platform.OS === "ios"
                          ? "AvenirNext-DemiBold"
                          : "Roboto",
                      color: "white"
                    }}
                  >
                    Search
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: "50%",
                      height: 5,
                      backgroundColor: "white",
                      opacity: 0.4,
                      borderRadius: 50
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    cars: state.carReducer.cars,
    loading: state.loginReducer.loading,
    carModalVisible: state.carReducer.carModalVisible,
    searchModalVisible: state.carReducer.searchModalVisible,
    source: state.carReducer.source,
    filterModalVisible: state.carReducer.filterModalVisible,
    dateModalVisible: state.carReducer.dateModalVisible,
    search: state.carReducer.search
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchCars: search => {
    dispatch(actions.fetchCars(search));
  },
  doOpenFilterModal: () => {
    dispatch(actions.openFilterModal());
  },
  doSetCar: car => {
    dispatch(actions.selectCar(car));
  },
  doOpenCarModal: () => {
    dispatch(actions.openCarModal());
  },
  doOpenSearchModal: () => {
    dispatch(actions.openSearchModal());
  },
  doSetSource: source => {
    dispatch(actions.setSource(source));
  },
  openDateModal: () => {
    dispatch(actions.openDateModal());
  },
  doSetRentingDate: (dateStart, dateEnd) => {
    dispatch(actions.setRentingDate(dateStart, dateEnd));
  },
  doSetMakeModel: (make, model) => {
    dispatch(actions.setMakeModel(make, model));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);

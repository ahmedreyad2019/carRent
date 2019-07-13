import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  StatusBar,
  FlatList
} from "react-native";
import { LinearGradient } from "expo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Detail from "../components/Detail";
import AppText from "../components/AppText";
import { Header, ButtonGroup } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";

class TransactionsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconName: "ios-arrow-up",
      order: "asc",
      keys: [],
      selectedKey: "",
      selectedIndex: 0
    };
  }
  componentDidMount = () => {
    this.props.doFetchTransactions();
  };
  _onRefresh = () => {
    this.props.doFetchTransactions();
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
  getdateString = (date, hi) => {
    var today = new Date(date);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var year = today
      .getFullYear()
      .toLocaleString()
      .substring(3);
    var month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    if (hi) {
      return (
        today.getDate() +
        " " +
        month[today.getMonth()] +
        ", " +
        this.getTimeString(date)
      );
    }

    return today.getDate() + "/" + (today.getMonth() + 1);
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText
              size={16}
              style={{ color: "white" }}
              text={"Your Bookings"}
            />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Profile")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <View style={{ backgroundColor: colors.primary, top: -5 }}>
          <ButtonGroup
            selectedButtonStyle={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomWidth: 5,
              backgroundColor: colors.primary,
              borderBottomColor: "white"
            }}
            buttonStyle={{ borderWidth: 0 }}
            innerBorderStyle={{ width: 0 }}
            selectedTextStyle={{ color: "white", fontWeight: "bold" }}
            containerStyle={{
              left: 0,
              margin: 0,
              top: 5,
              backgroundColor: colors.primary,
              borderWidth: 0
            }}
            buttons={["Past", "Upcoming", "Current"]}
            selectedIndex={this.state.selectedIndex}
            onPress={event => {
              this.setState({
                selectedIndex: event
              });
            }}
          />
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this._onRefresh}
            />
          }
          data={
            this.state.selectedIndex === 0
              ? this.props.pastTransactions
              : this.state.selectedIndex === 1
              ? this.props.upcomingTransactions
              : this.props.currentTransactions
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("TransactionDetails"),
                  this.props.doSelectTransaction(item);
              }}
              style={{
                marginHorizontal: 10,
                marginVertical: 10,
                flexDirection: "column",
                borderBottomColor: "#ddd",
                height: 120,
                backgroundColor: "white",
                borderRadius: 10,
                shadowOpacity: 0.2,
                shadowRadius: 15,
                elevation: 20
              }}
            >
              <AppText
                size={13}
                text={item.price.toLocaleString() + " EGP"}
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  bottom: 10
                }}
              />
              <View
                style={{
                  position: "absolute",
                  right: 15,
                  top: 15,
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                <AppText
                  size={14}
                  fontStyle={"bold"}
                  text={item.cars.make}
                  style={{
                    color: colors.primary
                  }}
                />
                <AppText
                  size={20}
                  fontStyle={"bold"}
                  text={item.cars.model}
                  style={{
                    color: colors.primary
                  }}
                />
                <AppText
                  size={13}
                  text={
                    item.carOwners.firstName + " " + item.carOwners.lastName
                  }
                  style={{
                    color: "#888"
                  }}
                />
              </View>
              <AppText
                size={13}
                text={item.status}
                style={{ position: "absolute", right: 15, bottom: 10 }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: 15,
                  top: 15
                }}
              >
                <LinearGradient
                  colors={["transparent", "#123"]}
                  style={{
                    width: 5,
                    borderRadius: 2,
                    backgroundColor: "#59b",
                    height: 30,
                    marginRight: 5
                  }}
                />

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <AppText
                    text={this.getdateString(item.rentingDateStart, true)}
                  />

                  <AppText
                    text={this.getdateString(item.rentingDateEnd, true)}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "absolute",
                  left: 15,
                  bottom: 10
                }}
              >
                <Ionicons
                  name={"ios" + "-pin"}
                  size={15}
                  style={{ marginRight: 5 }}
                />

                <AppText text={item.location} size={15} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => {
            return item._id;
          }}
        />
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
    order: state.carReducer.order,
    search: state.carReducer.search,
    upcomingTransactions: state.carReducer.upcomingTransactions,
    pastTransactions: state.carReducer.pastTransactions,
    currentTransactions: state.carReducer.currentTransactions
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchTransactions: () => {
    dispatch(actions.fetchPastTransactions());
    dispatch(actions.fetchUpcomingTransactions());
    dispatch(actions.fetchCurrentTransactions());
  },
  doCloseRentModal: () => {
    dispatch(actions.closeRentModal());
  },
  doFetchCars: search => {
    dispatch(actions.fetchCars(search));
  },
  doSetOrder: () => {
    dispatch(actions.setOrder());
  },

  doRent: carID => {
    dispatch(actions.rent(carID));
  },
  doSelectTransaction: selectedTransaction => {
    dispatch(actions.selectTransaction(selectedTransaction));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsScreen);

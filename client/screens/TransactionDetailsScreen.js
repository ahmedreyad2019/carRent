import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Alert,
  Linking,
  RefreshControl,
  StatusBar,
  Clipboard,
  FlatList
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Detail from "../components/Detail";
import AppText from "../components/AppText";
import { Header, ButtonGroup } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";
import Rating from "../components/Rating";
import { LinearGradient } from "expo";

class TransactionDetailsScreen extends React.Component {
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
        days[today.getDay()] +
        ", " +
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
    const transaction = this.props.selectedTransaction;
    console.log(transaction);
    const { carOwners, cars } = transaction;
    return (
      <View style={{ flex: 1 }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText size={24} style={{ color: "white" }} text={"Details"} />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Transaction")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <ScrollView style={{ flex: 1 }}>
          <ImageCarousel images={cars.photosLink} full={true} />
          <View
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#ddd",
              paddingHorizontal: 30,
              paddingVertical: 20,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "baseline",
                justifyContent: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  justifyContent: "flex-start"
                }}
              >
                <AppText
                  fontStyle={"bold"}
                  size={18}
                  text={carOwners.firstName + " " + carOwners.lastName}
                />
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Ionicons
                    name={"md" + "-star-outline"}
                    size={15}
                    style={{ marginLeft: 5, marginRight: 3 }}
                  />

                  <AppText
                    text={(carOwners.rating ? carOwners.rating : 5).toFixed(1)}
                    fontStyle={"light"}
                    size={10}
                    style={{ color: "#888" }}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => Linking.openURL(`tel:${carOwners.mobileNumber}`)}
                onLongPress={async () =>
                  await Clipboard.setString(
                    carOwners.mobileNumber,
                    Alert.alert("Number copied")
                  )
                }
              >
                <Ionicons name={"ios" + "-call"} size={15} />
                <AppText
                  text={carOwners.mobileNumber}
                  style={{ color: "#888", marginHorizontal: 5 }}
                  size={12}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
                onPress={() => Linking.openURL(`mailto:${carOwners.email}`)}
                onLongPress={async () =>
                  await Clipboard.setString(
                    carOwners.email,
                    Alert.alert("Email copied")
                  )
                }
              >
                <Ionicons name={"ios" + "-mail"} size={15} />
                <AppText
                  text={carOwners.email}
                  style={{ color: "#888", marginHorizontal: 5 }}
                  size={12}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start"
                  }}
                >
                  <AppText text={cars.make} />
                  <View
                    style={{ flexDirection: "row", alignItems: "baseline" }}
                  >
                    <AppText text={cars.model} />
                    <AppText
                      fontStyle={"light"}
                      size={12}
                      text={" " + cars.year}
                      style={{ color: "#888" }}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <AppText
                    size={12}
                    text={cars.plateNumber}
                    style={{ color: "#888" }}
                  />
                  <Ionicons
                    name={"md" + "-star-outline"}
                    size={15}
                    style={{ marginLeft: 10, marginRight: 3 }}
                  />

                  <AppText
                    text={cars.rating.toFixed(1)}
                    fontStyle={"light"}
                    size={10}
                    style={{ color: "#888" }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#ddd",
              paddingHorizontal: 40,
              paddingVertical: 20,
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "stretch"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}
              >
                <Ionicons
                  name={"ios" + "-pin"}
                  size={20}
                  style={{ marginRight: 5 }}
                />

                <AppText text={transaction.location} size={18} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                    alignItems: "flex-start"
                  }}
                >
                  <AppText
                    text={this.getdateString(
                      transaction.rentingDateStart,
                      true
                    )}
                  />

                  <AppText
                    text={this.getdateString(transaction.rentingDateEnd, true)}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 0.3,
              borderBottomColor: "#ddd",
              paddingHorizontal: 40,
              paddingVertical: 20,
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <AppText text={"Price per day"} />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AppText style={{ color: "#888" }} size={16} text={"EGP "} />
                <AppText
                  size={20}
                  fontStyle={"bold"}
                  text={transaction.price.toLocaleString()}
                />
              </View>
            </View>
          </View>
        </ScrollView>
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
    selectedTransaction: state.carReducer.selectedTransaction,
    order: state.carReducer.order,
    search: state.carReducer.search,
    upcomingTransactions: state.carReducer.upcomingTransactions,
    pastTransactions: state.carReducer.pastTransactions
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchTransactions: () => {
    dispatch(actions.fetchPastTransactions());
    dispatch(actions.fetchUpcomingTransactions());
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
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionDetailsScreen);

import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Switch,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Rating from "../components/Rating";
import Detail from "../components/Detail";
import AppText from "../components/AppText";
import { Header } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";

class RentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconName: "ios-arrow-up",
      order: "asc",
      keys: [],
      selectedKey: ""
    };
  }
  getdateString = (date, year) => {
    var today = new Date(date);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    return (
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      (year ? "/" + today.getFullYear() : "")
    );
  };

  render() {
    const { selectedCar } = this.props;
    transaction = selectedCar;
    car = selectedCar.cars;
    date1 = new Date(transaction.rentingDateStart);
    date2 = new Date(transaction.rentingDateEnd);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
      <View
        style={{ flexDirection: "column", justifyContent: "center", flex: 1 }}
      >
        <Header
          backgroundColor={colors.primary}
          centerComponent={
            <AppText
              size={24}
              style={{ color: "white" }}
              text={car.make + " " + car.model}
            />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate(
                  this.props.navigation.getParam("prev")
                )
              }
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <ScrollView>
          <ImageCarousel images={car.photosLink} full />

          <View style={{ marginHorizontal: 10 }}>
            <Text
              style={{
                color: colors.primary,
                fontSize: 28,
                fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
              }}
            >
              Details
            </Text>

            <Detail data={car.make} field={"Manufacturer"} />
            <Detail data={car.model} field={"Model"} />
            <Detail data={car.year} field={"Year"} />
            <Detail data={car.location} field={"Location"} />
            <Detail data={car.rating + "/5"} field={"Rating"} />
            <Detail data={car.transmission} field={"Transmission"} />
            <Detail data={car.color} field={"Color"} />
            <Detail data={car.seatingCapacity} field={"Seating Capacity"} />

            <Detail
              data={this.getdateString(transaction.rentingDateStart, true)}
              field={"Renting start date"}
            />
            <Detail
              data={this.getdateString(transaction.rentingDateEnd, true)}
              field={"Renting end date"}
            />
          </View>
        </ScrollView>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eeeeee",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingVertical: 7
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderTopWidth: 0.5,
              borderTopColor: "#dedede",
              borderBottomWidth: 0.5,
              borderBottomColor: "#dedede",
              marginVertical: 10
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
                name={"ios" + "-calendar"}
                size={30}
                style={{ marginRight: 15 }}
              />

              <AppText text={"Flexible"} size={15} />
            </View>
            <Switch
              value={this.state.flexible}
              onValueChange={() => {
                this.setState(prevState => ({
                  flexible: !prevState.flexible
                }));
              }}
            />
          </View>
          <AppText
            text={
              "Total Price: " +
              (transaction.price * diffDays).toLocaleString() +
              " EGP (" +
              transaction.price.toLocaleString() +
              " EGP/day)"
            }
          />
          <TouchableOpacity
            disabled={transaction.status === "Booked"}
            onPress={() =>
              this.props.user.drivingLicenseRequest
                ? (this.props.doRent(car._id),
                  this.props.doFetchCars(this.props.search))
                : this.props.navigation.navigate("AddDrivingLicense")
            }
            style={{
              backgroundColor:
                transaction.status !== "Booked" ? colors.primary : "green",
              flexDirection: "row",
              justifyContent: "center",
              height: 50,
              width: "100%",
              marginVertical: 10,

              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily:
                  Platform.OS === "ios" ? "AvenirNext-DemiBold" : "Roboto",
                color: "white"
              }}
            >
              {"Rent" + (transaction.status === "Booked" ? "ed" : "")}
            </Text>
            {this.props.loading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <></>
            )}
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
    order: state.carReducer.order,
    search: state.carReducer.search,
    user: state.loginReducer.user
  };
};

const mapDispatchToProps = dispatch => ({
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
)(RentModal);

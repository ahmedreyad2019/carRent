import { connect } from "react-redux";
import React from "react";
import {
  View,
  PickerIOS,
  Easing,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  Text
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Rating from "../components/Rating";
import Detail from "./Detail";

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
      "/" +
      (year ? today.getFullYear() : "")
    );
  };

  render() {
    const { selectedCar } = this.props;
    const transaction = selectedCar;
    const car = selectedCar.cars[0];
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            ...styles.CompanyDetails,
            padding: 10,
            paddingTop: 40
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              right: 15
            }}
            onPress={() => {
              this.props.doCloseRentModal();
            }}
          >
            <Ionicons name={"ios-close"} size={40} color={"#F08080"} />
          </TouchableOpacity>
          <ScrollView>
            <View
              style={{
                backgroundColor: "#eeeeee",
                width: "100%",
                height: 150
              }}
            >
              <Text>images appear here</Text>
            </View>
            <View>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 28,
                  fontFamily: "AvenirNext-Bold"
                }}
              >
                Details
              </Text>
              <Detail data={car.make} field={"Manufacturer"} />
              <Detail data={car.model} field={"Model"} />
              <Detail data={car.year} field={"Year"} />
              <Detail data={car.location} field={"Location"} />
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
          <TouchableOpacity
            disabled={transaction.status === "Done"}
            onPress={() => (
              this.props.doRent(car._id),
              this.props.doFetchCars(this.props.search)
            )}
            style={{
              backgroundColor:
                transaction.status !== "Done" ? colors.primary : "green",
              position: "absolute",
              bottom: 10,
              width: "25%",
              height: 50,
              alignSelf: "flex-end",
              right: 10,
              borderRadius: 50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "AvenirNext-DemiBold",
                color: "white"
              }}
            >
              Rent
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
    search: state.carReducer.search
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

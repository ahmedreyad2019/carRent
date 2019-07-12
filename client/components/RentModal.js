import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Rating from "../components/Rating";
import Detail from "./Detail";
import AppText from "./AppText";
import { Header } from "react-native-elements";
import ImageCarousel from "./ImageCarousel";

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
    const transaction = selectedCar;
    const car = selectedCar.cars[0];
    date1 = new Date(transaction.rentingDateStart);
    date2 = new Date(transaction.rentingDateEnd);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const images = [
      "../images/bmw-3-series-render.jpg",
      "../images/bmw-4-series-render.jpg",
      "../images/bmw-5-series-render.jpg"
    ];
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
              onPress={() => this.props.navigation.navigate("Cars")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <ScrollView>
          <ImageCarousel images={car.photosLink} full={400} />

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
            padding: 20
          }}
        >
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
            disabled={transaction.status === "Done"}
            onPress={() => (
              this.props.doRent(car._id),
              this.props.doFetchCars(this.props.search)
            )}
            style={{
              backgroundColor:
                transaction.status !== "Done" ? colors.primary : "green",
              flexDirection: "row",
              justifyContent: "center",
              height: 50,
              width: "100%",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily:   Platform.OS === "ios" ? "AvenirNext-DemiBold":"Roboto",
                color: "white"
              }}
            >
              {"Rent" + (transaction.status === "Done" ? "ed" : "")}
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

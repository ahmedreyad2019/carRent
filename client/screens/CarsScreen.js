import React from "react";
import {
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Modal,
  ImageBackground,
  View,
  Platform
} from "react-native";
import { Header, Image } from "react-native-elements";
import Filter from "../components/Filter";
import RentScreen from "../screens/RentScreen";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";

import Rating from "../components/Rating";
import AppText from "../components/AppText";
import ImageCarousel from "../components/ImageCarousel";

class CarsScreen extends React.Component {
  componentDidMount() {}

  constructor(props) {
    super(props);
    this.state = {
      investor: null,
      loading: true,
      hi: false,
      refresh: false,
      data: []
    };
  }
  _onRefresh = () => {
    this.props.doFetchCars(this.props.search);
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
    return (
      days[today.getDay()] +
      ", " +
      month[today.getMonth()] +
      " " +
      today.getDate() +
      "," +
      year
    );
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          backgroundColor={colors.primary}
          rightComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("MapCars")}
            >
              <Ionicons name={"ios-pin"} size={20} color={"#74808E"} />
            </TouchableOpacity>
          }
          centerComponent={
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                width: "100%",
                borderRadius: 50,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AppText
                style={{ color: "white" }}
                text={
                  (this.props.search.make !== "Any"
                    ? this.props.search.make + " " + this.props.search.model
                    : "Any cars") +
                  " in " +
                  this.props.search.location
                }
              />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Main")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.filterModalVisible}
        >
          <Filter />
        </Modal>

        <View
          style={{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderBottomColor: "#cccccc",
            borderBottomWidth: 1,
            backgroundColor: "white"
          }}
        >
          <View
            onPress={() => this.props.doOpenFilterModal()}
            style={{ flexDirection: "column" }}
          >
            <AppText text={"From "} />
            <AppText
              style={{ color: "#aaaaaa" }}
              text={this.getdateString(
                this.props.search.rentingDateStart,
                true
              )}
            />
          </View>
          <View
            style={{
              borderRightColor: "#cccccc",
              borderRightWidth: 1,
              height: "50%"
            }}
          />
          <View style={{ flexDirection: "column" }}>
            <AppText text={"To "} />
            <AppText
              style={{ color: "#aaaaaa" }}
              text={this.getdateString(this.props.search.rentingDateEnd, true)}
            />
          </View>
        </View>

        <ScrollView
          bouncesZoom={true}
          pagingEnabled={true}
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: colors.backgroundMain
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this._onRefresh}
            />
          }
        >
          <StatusBar barStyle={"light-content"} />
          <>
            <View>
              {this.props.cars.length === 0 && !this.props.loading ? (
                <AppText
                  style={{ alignSelf: "center" }}
                  text={
                    "No cars available at the moment! Please try again later."
                  }
                />
              ) : (
                <FlatList
                  snapToInterval={240}
                  bouncesZoom
                  indicatorStyle={"white"}
                  snapToAlignment={"start"}
                  decelerationRate="fast"
                  data={this.props.cars}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.doSetCar(item),
                          this.props.navigation.navigate("Rent", {
                            prev: "Cars"
                          });
                      }}
                      activeOpacity={1}
                      colors={["transparent", "rgba(0,0,0,0.2)"]}
                      style={{
                        ...styles.carCard
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            item.status !== "Booked" ? colors.primary : "green",
                          zIndex: 9090909090,
                          width: 60,
                          height: 30,
                          position: "absolute",
                          top: 25,
                          right: 25,
                          borderRadius: 50,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <AppText
                          fontStyle={"bold"}
                          size={14}
                          style={{
                            color: "white"
                          }}
                          text={item.status !== "Booked" ? "Book" : "Booked"}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          backgroundColor: "white",
                          zIndex: 9090909090,
                          width: 80,
                          height: 65,
                          position: "absolute",
                          top: 150,
                          right: 20,
                          borderBottomLeftRadius: 15,
                          borderTopLeftRadius: 15,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <AppText
                            fontStyle={"italic"}
                            size={18}
                            text={item.price.toLocaleString()}
                          />
                          <AppText text={"EGP"} size={10} />
                        </View>
                        <AppText
                          fontStyle={"light"}
                          size={12}
                          text={
                            this.getdateString(item.rentingDateStart) +
                            " - " +
                            this.getdateString(item.rentingDateEnd)
                          }
                        />
                      </View>
                      <ImageCarousel images={item.cars.photosLink} />

                      <View
                        style={{
                          height: 60,
                          width: "100%",
                          paddingLeft: 5,
                          alignItems: "flex-start",
                          borderBottomWidth: 1.5,
                          borderBottomColor: "#eee"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "baseline"
                          }}
                        >
                          <AppText
                            fontStyle={"bold"}
                            size={23}
                            style={{
                              color: colors.primary
                            }}
                            text={item.cars.make + " " + item.cars.model}
                          />
                          <AppText
                            size={12}
                            style={{
                              color: colors.primary,
                              fontFamily:
                                Platform.OS === "ios"
                                  ? "AvenirNext-DemiBold"
                                  : "Roboto",
                              opacity: 0.7
                            }}
                            text={" " + item.cars.year}
                          />
                        </View>
                        <Rating rating={item.cars.rating} />
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => {
                    return item._id;
                  }}
                />
              )}
            </View>
          </>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    cars: state.carReducer.cars,
    loading: state.loginReducer.loading,
    companyModalVisible: state.carReducer.companyModalVisible,
    searchModalVisible: state.carReducer.searchModalVisible,
    source: state.carReducer.source,
    filterModalVisible: state.carReducer.filterModalVisible,
    search: state.carReducer.search,
    rentModalVisible: state.carReducer.rentModalVisible
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchCars: search => {
    dispatch(actions.fetchCars(search));
  },
  doRent: carID => {
    dispatch(actions.rent(carID));
  },
  doOpenFilterModal: () => {
    dispatch(actions.openFilterModal());
  },
  doOpenRentModal: () => {
    dispatch(actions.openRentModal());
  },
  doSetCar: car => {
    dispatch(actions.selectCar(car));
  },

  doOpenSearchModal: () => {
    dispatch(actions.openSearchModal());
  },
  doSetSource: source => {
    dispatch(actions.setSource(source));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CarsScreen);

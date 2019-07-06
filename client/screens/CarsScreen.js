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
  View
} from "react-native";
import { Header, Image } from "react-native-elements";
import Filter from "../components/Filter";
import RentModal from "../components/RentModal";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import CompanyDetials from "../components/CompanyDetails";
import SearchModal from "../components/SearchModal";

import Rating from "../components/Rating";
import AppText from "../components/AppText";

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
        month[today.getMonth()] +
        " " +
        today.getDate() +
        ", " +
        year +
        " " +
        this.getTimeString(date)
      );
    }

    return today.getDate() + "/" + (today.getMonth() + 1);
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          backgroundColor={colors.primary}
          rightComponent={
            <Ionicons
              name={"ios-funnel"}
              onPress={() => this.props.doOpenFilterModal()}
              size={20}
              color={"#74808E"}
            />
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
                text={this.props.search.location}
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
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
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
                    <View
                      colors={["transparent", "rgba(0,0,0,0.2)"]}
                      style={{
                        ...styles.carCard
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor: colors.primary,
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
                        onPress={() => {
                          this.props.doSetCar(item),
                            this.props.navigation.navigate("Rent");
                        }}
                      >
                        <AppText
                          fontStyle={"bold"}
                          size={14}
                          style={{
                            color: "white"
                          }}
                          text={"Book"}
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
                          borderBottomLeftRadius: 50,
                          borderTopLeftRadius: 50,
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
                          <AppText text={"EGP"} fontStyle={"bold"} size={10} />
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

                      <ImageBackground
                        source={require("../images/bmw-3-series-render.jpg")}
                        style={{
                          backgroundColor: "#eeeeee",
                          width: "100%",
                          height: 150
                        }}
                      >
                        <AppText text={"images appear here"} />
                      </ImageBackground>
                      <View
                        style={{
                          height: 60,
                          width: "100%",
                          paddingLeft: 5,
                          alignItems: "flex-start"
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
                            text={item.cars[0].make + " " + item.cars[0].model}
                          />
                          <AppText
                            size={12}
                            style={{
                              color: colors.primary,
                              fontFamily: "AvenirNext-DemiBold",
                              opacity: 0.7
                            }}
                            text={" " + item.cars[0].year}
                          />
                        </View>
                        <Rating rating={item.cars[0].rating} />
                      </View>
                    </View>
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
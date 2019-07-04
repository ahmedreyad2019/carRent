import React from "react";
import {
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Text,
  StatusBar,
  Modal,
  View
} from "react-native";
import { Header } from "react-native-elements";
import Filter from "../components/Filter";
import RentModal from "../components/RentModal";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import CompanyDetials from "../components/CompanyDetails";
import SearchModal from "../components/SearchModal";
import Rating from "../components/Rating";

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

  getdateString = date => {
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

    return today.getDate() + "/" + (today.getMonth() + 1);
  };
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          backgroundColor={colors.primary}
          rightComponent={
            <Ionicons
              name={"ios-search"}
              onPress={() => (
                this.props.doOpenSearchModal(),
                this.props.doSetSource("FeedScreen")
              )}
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
              <Text style={{ color: "white" }}>
                {this.props.search.location}
              </Text>
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
          animationType="fade"
          transparent={true}
          visible={this.props.searchModalVisible}
          key={2}
        >
          <SearchModal key={4} />
        </Modal>
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
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.rentModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <RentModal />
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
          <TouchableOpacity
            onPress={() => this.props.doOpenFilterModal()}
            style={{ flexDirection: "row" }}
          >
            <Text>{"Filter "}</Text>
            <Ionicons name={"ios-options"} size={20} color={"black"} />
          </TouchableOpacity>
          <View
            style={{
              borderRightColor: "#cccccc",
              borderRightWidth: 1,
              height: "100%"
            }}
          />
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text>{"Map "}</Text>
            <Ionicons name={"ios-pin"} size={20} color={"black"} />
          </TouchableOpacity>
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
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.props.companyModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <CompanyDetials />
            </Modal>
            <View>
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
                          this.props.doOpenRentModal();
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: "white",
                          fontFamily: "AvenirNext-Bold"
                        }}
                      >
                        Rent
                      </Text>
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
                      <Text>
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "AvenirNext-BoldItalic"
                          }}
                        >
                          {item.price}
                        </Text>

                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: "AvenirNext-Bold"
                          }}
                        >
                          {"EGP"}
                        </Text>
                      </Text>

                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: "Avenir-Light"
                        }}
                      >
                        {this.getdateString(item.rentingDateStart) +
                          " - " +
                          this.getdateString(item.rentingDateEnd)}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#eeeeee",
                        width: "100%",
                        height: 150
                      }}
                    >
                      <Text>images appear here</Text>
                    </View>
                    <View
                      style={{
                        height: 60,
                        width: "100%",
                        paddingLeft: 5,
                        alignItems: "flex-start"
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 23,
                          fontFamily: "AvenirNext-Bold"
                        }}
                      >
                        {item.cars[0].make} {item.cars[0].model}
                        <Text
                          style={{
                            color: colors.primary,
                            fontFamily: "AvenirNext-DemiBold",
                            opacity: 0.5,
                            fontSize: 12
                          }}
                        >
                          {" " + item.cars[0].year}
                        </Text>
                      </Text>
                      <Rating rating={item.cars[0].rating} />
                    </View>
                  </View>
                )}
                keyExtractor={item => {
                  return item._id;
                }}
              />
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

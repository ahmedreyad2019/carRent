import React from "react";
import {Platform} from 'react-native';
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
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import SearchModal from "../components/SearchModal";
import Rating from "../components/Rating";
import DatePicker from "../components/DatePicker";
import PickerLocation from "../components/PickerLocation";

class MainScreen extends React.Component {
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
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.openDrawer()}
          style={{ position: "absolute", top: 25, left: 10 }}
        >
          <Ionicons name={"ios-menu"} size={30} color={"#888"} />
        </TouchableOpacity>

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
          style={{ alignItems: "flex-end" }}
          transparent={true}
          animationType={"slide"}
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
            marginTop: 100,
            marginHorizontal: 5,
            shadowRadius: 3,
            shadowOffset: { height: 2 },
            shadowColor: "black",
            shadowOpacity: 0.2,
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            elevation:1
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
                this.props.openDateModal(), this.setState({ source: "From" })
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
                  fontFamily:Platform.OS === 'ios'? "AvenirNext-Bold":'Roboto',
                }}
              >
                {this.getdateString(this.props.search.rentingDateStart)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontFamily:Platform.OS === 'ios'? "AvenirNext-DemiBold":'Roboto',
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
                this.props.openDateModal(), this.setState({ source: "To" })
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
                  fontFamily:Platform.OS === 'ios'? "AvenirNext-Bold":'Roboto',
                      }}
              >
                {this.getdateString(this.props.search.rentingDateEnd)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary,
                  fontFamily:Platform.OS === 'ios'? "AvenirNext-DemiBold":'Roboto',
                }}
              >
                {this.getTimeString(this.props.search.rentingDateEnd)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => (
            this.props.navigation.navigate("Cars"),
            this.props.doFetchCars(this.props.search)
          )}
          style={{
            height: 40,
            flexDirection: "column",
            marginHorizontal: 100,
            alignItems: "center",
            justifyContent: "space-evenly",
            backgroundColor: colors.primary,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            shadowRadius: 3,
            shadowOffset: { height: 2 },
            shadowColor: "black",
            shadowOpacity: 0.2,
            zIndex: -1
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily:Platform.OS === 'ios'? "AvenirNext-DemiBold":'Roboto',
              color: "white"
            }}
          >
            Search
          </Text>
          <View
            style={{
              width: "50%",
              height: 5,
              backgroundColor: "white",
              opacity: 0.4,
              borderRadius: 50
            }}
          />
        </TouchableOpacity>
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
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);

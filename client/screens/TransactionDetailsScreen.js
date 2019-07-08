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
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Detail from "../components/Detail";
import AppText from "../components/AppText";
import { Header, ButtonGroup } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";

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
    const _data = [
      this.props.pastTransactions,
      this.props.upcomingTransactions,
      []
    ];
    const transaction = this.props.selectedTransaction;
    const { carOwners, cars } = transaction;
    return (
      <View style={{ flex: 1 }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText
              size={24}
              style={{ color: "white" }}
              text={"Details"}
            />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Transaction")}
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
        <View>
          <AppText text={cars.make} />
          <AppText text={carOwners.firstName} />
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

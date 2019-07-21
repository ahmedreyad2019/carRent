import React, { Component } from "react";
import {
  View,
  DatePickerIOS,
  DatePickerAndroid,
  Text,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from "../actions/index";
import { connect } from "react-redux";
import { styles, colors } from "../styles";
import DatePickerA from "react-native-datepicker";

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
  }
  setDateAndroid = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        minDate: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ androidDate: `${day}/${month + 1}/${year}` });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  setTimeAndroid = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        const m = minute < 10 ? `0${minute}` : minute;
        const h = hour < 10 ? `0${hour}` : hour;
        console.log(`time: ${hour}:${minute}`);
        this.setState({ chosenAndroidTime: `${h}:${m}` });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };
  render() {
    date1 = new Date(this.props.search.rentingDateStart);
    date2 = new Date(this.props.search.rentingDateEnd);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        <View
          style={{
            ...styles.CompanyDetails,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            padding: 0,
            borderTopWidth: 1,
            borderTopColor: "#dddddd",
            height: 250,
            position: "absolute",
            bottom: 0
          }}
        >
          <View
            style={{
              height: 40,
              borderBottomWidth: 0.3,
              borderBottomColor: "#eeeeee",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: colors.primary,
                fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
              }}
            >
              {this.props.header}
            </Text>
          </View>

          <DatePickerIOS
            mode={"date"}
            date={new Date(this.props.date)}
            style={{ color: "white" }}
            onDateChange={this.props.onDateChange}
          />

          <Ionicons
            name={"ios-close"}
            size={40}
            color={"black"}
            style={{
              position: "absolute",
              top: 0,
              right: 15
            }}
            onPress={() => this.props.doCloseDateModal()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.loginReducer.user,
    token: state.loginReducer.token,
    companies: state.carReducer.companies,
    loading: state.loginReducer.loading,
    selectedCompany: state.carReducer.selectedCompany,
    search: state.carReducer.search
  };
};

const mapDispatchToProps = dispatch => ({
  doCloseDateModal: () => {
    dispatch(actions.closeDateModal());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DatePicker);

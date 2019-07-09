import React, { Component } from "react";
import { View, DatePickerIOS, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from "../actions/index";
import { connect } from "react-redux";
import { styles, colors } from "../styles";
import Platform from "react-native"

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { chosenDate: new Date() };
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: "column-reverse" }}>
        <View
          style={{
            ...styles.CompanyDetails,
            padding: 0,
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
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 25,
                color: colors.primary,
                fontFamily: Platform.OS==='ios'?"AvenirNext-Bold":"Roboto"
              }}
            >
              {this.props.header}
            </Text>
          </View>
          <DatePickerIOS
            mode={"datetime"}
            date={new Date(this.props.date)}
            style={{ color: "white" }}
            onDateChange={this.props.onDateChange}
          />

          <Ionicons
            name={"ios-close"}
            size={40}
            color={"#F08080"}
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
    selectedCompany: state.carReducer.selectedCompany
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

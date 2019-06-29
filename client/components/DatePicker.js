import React, { Component } from "react";
import { View, DatePickerIOS } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from "../actions/index";
import { connect } from "react-redux";
import { styles } from "../styles";

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
              borderBottomColor: "#74808E"
            }}
          />
          <DatePickerIOS
            mode={"date"}
            date={new Date(this.props.user.dob)}
            style={{ color: "white" }}
            onDateChange={newDate => this.setState({ chosenDate: newDate })}
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
    companies: state.companyReducer.companies,
    loading: state.loginReducer.loading,
    selectedCompany: state.companyReducer.selectedCompany
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

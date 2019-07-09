import { connect } from "react-redux";
import React from "react";
import { View, Text, TouchableOpacity,Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import * as actions from "../actions/index";

class Status extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getLawyerCircle = () => {
    switch (this.props.selectedCompany.status) {
      case "PendingLawyer":
        return {
          ...styles.circle,
          backgroundColor: "white",
          borderColor: "#4FDBBA"
        };
      case "RejectedLawyer":
        return {
          ...styles.circle,
          backgroundColor: "white",
          borderColor: "#F08080"
        };
      default:
        return {
          ...styles.circle,
          backgroundColor: "#4FDBBA",
          borderColor: "#4FDBBA"
        };
    }
  };
  getReviewerCircle = () => {
    switch (this.props.selectedCompany.status) {
      case "PendingReviewer":
        return {
          ...styles.circle,
          backgroundColor: "white",
          borderColor: "#4FDBBA"
        };
      case "RejectedReviewer":
        return {
          ...styles.circle,
          backgroundColor: "white",
          borderColor: "#F08080"
        };
      case "AcceptedReviewer":
      case "Accepted":
        return {
          ...styles.circle,
          backgroundColor: "#4FDBBA",
          borderColor: "#4FDBBA"
        };

      default:
        return {
          ...styles.circle,
          borderColor: "#74808E",
          backgroundColor: "#fff"
        };
    }
  };

  getLawyer = () => {
    switch (this.props.selectedCompany.status) {
      case "PendingLawyer":
      case "RejectedLawyer":
        return {
          ...styles.rectangle,
          backgroundColor: "#74808E"
        };

      default:
        return {
          ...styles.rectangle,
          backgroundColor: "#4FDBBA"
        };
    }
  };
  getReviewer = () => {
    switch (this.props.selectedCompany.status) {
      case "PendingReviewer":
      case "RejectedReviewer":
      case "PendingLawyer":
      case "RejectedLawyer":
        return {
          ...styles.rectangle,
          backgroundColor: "#74808E"
        };

      default:
        return {
          ...styles.rectangle,
          backgroundColor: "#4FDBBA"
        };
    }
  };
  getPayment = () => {
    switch (this.props.selectedCompany.status) {
      case "PendingReviewer":
      case "RejectedReviewer":
      case "PendingLawyer":
      case "RejectedLawyer":
        return {
          ...styles.circle,
          borderColor: "#74808E",
          backgroundColor: "#fff"
        };
      case "AcceptedReviewer":
        return {
          ...styles.circle,
          backgroundColor: "white",
          borderColor: "#4FDBBA"
        };

      default:
        return {
          ...styles.circle,
          backgroundColor: "#4FDBBA",
          borderColor: "#4FDBBA"
        };
    }
  };

  render() {
    return (
      <View
        style={{
          position: "absolute",
          alignSelf: "center",
          bottom: 50,
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View style={this.getLawyerCircle()} />
          <View style={this.getLawyer()} />
          <View style={this.getReviewerCircle()} />
          <View style={this.getReviewer()} />
          <View style={this.getPayment()} />
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#DBD7DF",
            fontSize: 15,
            fontFamily:Platform.OS==='ios'? "AvenirNext-DemiBold":"Roboto"
          }}
        >
          {this.props.selectedCompany.status}
        </Text>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.loginReducer.token,
    companies: state.carReducer.companies,
    loading: state.loginReducer.loading,
    selectedCompany: state.carReducer.selectedCompany
  };
};

const mapDispatchToProps = dispatch => ({
  doCloseCompanyModal: () => {
    dispatch(actions.closeCarModal());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Status);

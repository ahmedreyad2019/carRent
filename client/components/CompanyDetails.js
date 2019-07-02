import { connect } from "react-redux";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import * as actions from "../actions/index";
import Status from "../components/Status";
class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.CompanyDetails}>
        <Text
          style={{
            color: "#DBD7DF",
            textAlign:'center',
            fontSize: 23,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          
           {this.props.selectedCompany.nameInEnglish} ({this.props.selectedCompany.nameInArabic})
        </Text>
       
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          Regulation Law: {this.props.selectedCompany.regulationLaw}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          cityHQ: {this.props.selectedCompany.cityHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          addressHQ: {this.props.selectedCompany.addressHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          governerateHQ: {this.props.selectedCompany.governerateHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          telephoneHQ: {this.props.selectedCompany.telephoneHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          faxHQ: {this.props.selectedCompany.faxHQ}
        </Text>
       
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          Capital:{" "}
          {this.props.selectedCompany.capital +" "+
            this.props.selectedCompany.capitalCurrency}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: "AvenirNext-DemiBold"
          }}
        >
          Investor Name: {this.props.selectedCompany.investorName}
        </Text>

        <Status />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
            right: 15,
            alignSelf: "flex-end",
            shadowOpacity: 0.4,
            shadowRadius: 3,
            shadoOffset: {
              height: 3
            }
          }}
          onPress={() => this.props.doCloseCompanyModal()}
        >
          <Ionicons name={"ios-close"} size={40} color={"#F08080"} />
        </TouchableOpacity>
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
)(CompanyDetails);

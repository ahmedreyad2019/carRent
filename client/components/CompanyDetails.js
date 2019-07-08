import { connect } from "react-redux";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "../styles";
import * as actions from "../actions/index";
import Status from "../components/Status";
import Platform from "react-native"
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
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          
           {this.props.selectedCompany.nameInEnglish} ({this.props.selectedCompany.nameInArabic})
        </Text>
       
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          Regulation Law: {this.props.selectedCompany.regulationLaw}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          cityHQ: {this.props.selectedCompany.cityHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          addressHQ: {this.props.selectedCompany.addressHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          governerateHQ: {this.props.selectedCompany.governerateHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          telephoneHQ: {this.props.selectedCompany.telephoneHQ}
        </Text>
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
          }}
        >
          faxHQ: {this.props.selectedCompany.faxHQ}
        </Text>
       
        <Text
          style={{
            color: "#DBD7DF",

            fontSize: 15,
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
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
            fontFamily: Platform.OS==='ios'?"AvenirNext-DemiBold":"Roboto"
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
            elevation:1,
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

import {
  KeyboardAvoidingView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import React, { Component } from "react";
import { styles } from "../styles";
import { SearchBar } from "react-native-elements";
import * as actions from "../actions/index";

class SearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    const { approved, requested } = this.props.companies;
    var source =
      this.props.source === "companiesScreen"
        ? requested.concat(approved)
        : this.props.allCompanies;
    this.setState({ results2: source });
  };

  updateSearch = text => {
    const { approved, requested } = this.props.companies;
    var source =
      this.props.source === "companiesScreen"
        ? requested.concat(approved)
        : this.props.allCompanies;
    var companies = source
      .filter(function(company) {
        return (
          company.nameInEnglish.toLowerCase().includes(text.toLowerCase()) ||
          company.status.toLowerCase().includes(text.toLowerCase()) ||
          company.nameInArabic.toLowerCase().includes(text.toLowerCase()) ||
          company.investorName.toLowerCase().includes(text.toLowerCase())
        );
      })
      .map(function(country) {
        return country;
      });

    this.setState({ results2: companies, search: text });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          ...styles.CompanyDetails,
          backgroundColor: "#2C3646",
          paddingHorizontal: 0,
          paddingTop: 5
          ,marginHorizontal:2
        }}
        behavior="padding"
        enabled
      >
        <SearchBar
          containerStyle={{ backgroundColor: "#2C3646" }}
          platform="ios"
          placeholder="Type to search..."
          onChangeText={this.updateSearch}
          value={this.state.search}
          inputContainerStyle={{ height: 20 }}
          onCancel={() => this.props.doCloseSearchModal()}
          returnKeyType={"search"}
          autoFocus={true}
        />
        <FlatList
          keyboardDismissMode={"on-drag"}
          keyboardShouldPersistTaps={"always"}
       
          data={this.state.results2}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                height: 60,
                paddingHorizontal: 10,
                borderBottomColor: "#74808E",
                borderBottomWidth: 0.4,
                flex: 1,
                flexDirection: "column",
                justifyContent: "center"
              }}
              onPress={() => (
                Keyboard.dismiss(),
                this.props.doCloseSearchModal(),
                this.props.doOpenCompanyModal(),
                this.props.doSetCompany(item)
              )}
            >
              <Text style={{ color: "white", textAlignVertical: "top" }}>
                {item.nameInEnglish} ({item.nameInArabic})
              </Text>

              <Text style={{ color: "#74808E" }}>{item.investorName}</Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#B7C1CD",
                  alignSelf: "flex-end",
                  right: 10,
                  bottom: 5,
                  position: "absolute"
                }}
              >
                {item.status}
              </Text>
              <Text
                style={{
                  color: "#74808E",
                  alignSelf: "flex-end",
                  right: 10,
                  top: 5,
                  position: "absolute"
                }}
              >
                {item.legalCompanyForm}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => {
            return item._id;
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}
const mapStateToProps = state => {
  return {
    companies: state.companyReducer.companies,
    loading: state.loginReducer.loading,
    companyModalVisible: state.companyReducer.companyModalVisible,
    allCompanies: state.companyReducer.allCompanies,
    source: state.companyReducer.source
  };
};

const mapDispatchToProps = dispatch => ({
  doSetCompany: company => {
    dispatch(actions.selectCar(company));
  },
  doSetCompanies: company => {
    dispatch(actions.setCars(company));
  },
  doSetRequests: () => {
    dispatch(actions.setRequests());
  },
  doOpenCompanyModal: () => {
    dispatch(actions.openCarModal());
  },
  doCloseSearchModal: () => {
    dispatch(actions.closeSearchModal());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchModal);

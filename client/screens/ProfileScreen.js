import React from "react";
import {
  ActivityIndicator,
  Button,
  Switch,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
  RefreshControl
} from "react-native";
import { AsyncStorage } from "react-native";

import { Header } from "react-native-elements";
import { connect } from "react-redux";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Ionicons from "react-native-vector-icons/Ionicons";
import DatePicker from "../components/DatePicker";
import AppText from "../components/AppText";
import ProfileDetail from "../components/ProfileDetail";

class LinksScreen extends React.Component {
  componentDidMount() {
    this.makeRemoteRequest();
  }
  makeRemoteRequest = () => {
    const { userId } = this.props;
    AsyncStorage.getItem("jwt").then(res => {
      this.props.doFetch(userId, res);
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      date: null,
      investor: null,
      loading: true,
      refresh: false,
      data: [],
      user: "",
      editable: false,
      dateModalOpen: false
    };
  }
  _onRefresh = () => {
    this.makeRemoteRequest();
  };
  componentDidUpdate = () => {
    if (!this.props.token) this.props.navigation.navigate("Login");
  };
  openModalDate = () => {
    this.setState({ dateModalOpen: true });
  };
  render() {
    const { user } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "#fafaff", }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText size={16} style={{ color: "white" }} text={"Profile"} />
          }
          leftComponent={
            this.state.editable ? (
              <Button
                title={"Cancel"}
                onPress={() =>
                  this.setState(prevState => ({
                    editable: !prevState.editable
                  }))
                }
              />
            ) : (
              <></>
            )
          }
          rightComponent={
            this.state.editable ? (
              <></>
            ) : (
              <Button
                title={"Edit"}
                onPress={() =>
                  this.setState(prevState => ({
                    editable: !prevState.editable
                  }))
                }
              />
            )
          }
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this._onRefresh}
            />
          }
          contentContainerStyle={{ flexDirection: "column",paddingBottom:200 }}
        >
          <View style={styles.avatar}>
            <AppText
              size={32}
              fontStyle={"bold"}
              style={{ color: "white" }}
              text={
                user
                  ? (user.firstName + " " + user.lastName)
                      .split(" ")[0]
                      .substring(0, 1)
                      .toUpperCase() +
                    (user.firstName + " " + user.lastName)
                      .split(" ")
                      [
                        (user.firstName + " " + user.lastName).split(" ")
                          .length - 1
                      ].substring(0, 1)
                      .toUpperCase()
                  : console.log()
              }
            />
          </View>

          {user ? (
            <>
              <View style={{ alignSelf: "center" }}>
                <AppText
                  size={18}
                  text={user.firstName + " " + user.lastName}
                />
              </View>
              <View>
                <AppText
                  text={"Personal Details"}
                  size={17}
                  style={{ color: "#888", margin: 7 }}
                />
                <ProfileDetail
                  keyboardType={"phone-pad"}
                  top={true}
                  title={"Phone Number"}
                  value={user.mobileNumber}
                  icon={"call"}
                  editable={this.state.editable}
                />

                <ProfileDetail
                  keyboardType={"numeric"}
                  title={"Personal ID"}
                  value={user.personalID}
                  icon={"card"}
                  editable={this.state.editable}
                />
              </View>
            </>
          ) : (
            console.log()
          )}

          <View>
            <AppText
              text={"Payment Methods"}
              size={17}
              style={{ color: "#888", margin: 7, marginTop: 20 }}
            />
            <View
              style={{
                width: "100%",
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderTopWidth: 0.5,
                borderTopColor: "#dedede",
                borderBottomWidth: 0.5,
                borderBottomColor: "#dedede"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <Ionicons
                  name={Platform.OS + "-cash"}
                  size={35}
                  style={{ marginRight: 15 }}
                />

                <AppText text={"Cash"} size={15} />
              </View>
              <Switch
                value={user ? user.paymentMethod === "Cash" : false}
                onValueChange={() => {
                  this.setState(prevState => ({
                    user:
                      user.paymentMethod !== "cash"
                        ? { ...user, paymentMethod: "cash" }
                        : user
                  }));
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "100%",
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderBottomWidth: 0.5,
                borderBottomColor: "#dedede"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <AppText text={"Add Card"} size={15} />
              </View>
              <Ionicons name={Platform.OS + "-arrow-forward"} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
            onPress={()=>this.props.navigation.navigate("Transaction")}
              style={{
                width: "100%",
                backgroundColor: "white",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderTopWidth: 0.5,
                borderTopColor: "#dedede",
                borderBottomWidth: 0.5,
                borderBottomColor: "#dedede",
                marginVertical: 30
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
                <AppText text={"Transactions"} size={15} />
              </View>
              <Ionicons name={Platform.OS + "-arrow-forward"} size={20} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          style={{ alignItems: "flex-end" }}
          transparent={true}
          animationType={"slide"}
          visible={this.props.dateModalVisible}
        >
          <DatePicker />
        </Modal>

        <TouchableOpacity
          style={styles.buttonSignOut}
          onPress={() => this.props.signOut()}
        >
          <Text style={{ color: "#F08080" }}> Sign Out </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    loggedIn: state.loginReducer.loggedIn,
    user: state.loginReducer.user,
    loading: state.loginReducer.loading,
    token: state.loginReducer.token,
    userId: state.loginReducer.userId,
    dateModalVisible: state.carReducer.dateModalVisible
  };
};
const mapDispatchToProps = dispatch => ({
  doFetch: (userId, token) => {
    dispatch(actions.fetchProfile(userId, token));
  },
  signOut: () => {
    dispatch(actions.logout());
  },

  openDateModal: () => {
    dispatch(actions.openDateModal());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksScreen);

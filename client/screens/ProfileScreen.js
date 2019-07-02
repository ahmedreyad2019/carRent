import React from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  ScrollView,
  RefreshControl
} from "react-native";
import { AsyncStorage } from "react-native";

import { Header } from "react-native-elements";
import { connect } from "react-redux";
import { styles ,colors} from "../styles";
import * as actions from "../actions/index";
import Ionicons from "react-native-vector-icons/Ionicons";
import DatePicker from "../components/DatePicker";

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
      editable: false,
      dateModalOpen: false
    };
  }
  _onRefresh = () => {
    this.makeRemoteRequest();
  };
  componentDidUpdate = () => {
    if (!this.props.token) this.props.navigation.navigate("Home");
  };
  openModalDate = () => {
    this.setState({ dateModalOpen: true });
  };
  render() {
    const { user } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <StatusBar barStyle={"light-content"} />
        <Header
          backgroundColor={colors.backgroundMain}
          centerComponent={{
            text: "Profile",
            style: { color: "#74808E", fontWeight: "bold", fontSize: 20 }
          }}
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
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this._onRefresh}
            />
          }
        >
          <>
            <View style={{ flex: 0.25 }}>
              <View style={styles.avatar}>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "#90F6DE"
                  }}
                >
                  {user
                    ? user.name.split(" ")[0].substring(0, 1) +
                      user.name
                        .split(" ")
                        [user.name.split(" ").length - 1].substring(0, 1)
                    : console.log()}
                </Text>
              </View>
            </View>
            {user ? (
              <View style={{ flex: 0.75 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#bbbbbb",
                    fontWeight: "bold",
                    borderBottomColor: "#293749",
                    borderBottomWidth: this.state.editable ? 1 : 0
                  }}
                >
                  {user.name}
                </Text>

                <View
                  style={{
                    flexDirection: "row", height:30,
                    alignItems: "center"
                  }}
                >
                  <Ionicons
                    name={"ios-mail"}
                    style={{ flex: 0.1 }}
                    size={20}
                    color={"#90F6DE"}
                  />
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: "#bbbbbb",
                      flex: 0.9,
                      borderBottomColor: "#293749",
                      borderBottomWidth: this.state.editable ? 1 : 0
                    }}
                    value={user.mail}
                    editable={this.state.editable}
                  />
                </View>
                <TouchableOpacity
                  disabled={!this.state.editable}
                  onPress={() => this.props.openDateModal()}
                >
                  <View
                    style={{
                      flexDirection: "row", height:30,
                      alignItems: "center"
                    }}
                  >
                    <Ionicons
                      name={"ios-calendar"}
                      style={{ flex: 0.1 }}
                      size={20}
                      color={"#90F6DE"}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#bbbbbb",
                        flex: 0.9,
                        borderBottomColor: "#293749",
                        borderBottomWidth: this.state.editable ? 1 : 0
                      }}
                    >
                      {new Date(user.dob).toLocaleDateString("en-US")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row", height:30,
                    alignItems: "center"
                  }}
                >
                  <Ionicons
                    name={"ios-pin"}
                    onPress={()=>this.props.navigation.navigate("Cars")}
                    style={{ flex: 0.1 }}
                    size={20}
                    color={"#90F6DE"}
                  />
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: "#bbbbbb",
                      flex: 0.9,
                      borderBottomColor: "#293749",
                      borderBottomWidth: this.state.editable ? 1 : 0
                    }}
                    value={user.address}
                    editable={this.state.editable}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row", height:30,
                    alignItems: "center"
                  }}
                >
                  <Ionicons
                    name={"ios-call"}
                    style={{ flex: 0.1 }}
                    size={20}
                    color={"#90F6DE"}
                  />
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: "#bbbbbb",
                      flex: 0.9,
                      borderBottomColor: "#293749",
                      borderBottomWidth: this.state.editable ? 1 : 0
                    }}
                    value={user.telephone}
                    editable={this.state.editable}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row", height:30,
                    alignItems: "center"
                  }}
                >
                  <Ionicons
                    name={"ios-flag"}
                    style={{ flex: 0.1 }}
                    size={20}
                    color={"#90F6DE"}
                  />
                  <TextInput
                    style={{
                      fontSize: 16,
                      color: "#bbbbbb",
                      flex: 0.9,
                      borderBottomColor: "#293749",
                      borderBottomWidth: this.state.editable ? 1 : 0
                    }}
                    value={user.nationality}
                    editable={this.state.editable}
                  />
                </View>
                <TextInput
                  style={{
                    fontSize: 16,
                    color: "#bbbbbb",
                    borderBottomColor: "#293749",
                    borderBottomWidth: this.state.editable ? 1 : 0
                  }}
                  value={user.gender}
                  editable={this.state.editable}
                />
                <TextInput
                  style={{
                    fontSize: 16,
                    color: "#bbbbbb",
                    borderBottomColor: "#293749",
                    borderBottomWidth: this.state.editable ? 1 : 0
                  }}
                  value={user.idNumber + "/" + user.idType}
                  editable={this.state.editable}
                />
              </View>
            ) : (
              console.log()
            )}
          </>
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

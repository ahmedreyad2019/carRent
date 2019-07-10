import React from "react";
import {
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Vibration,
  StatusBar,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  Keyboard,
  Button,
  Image
} from "react-native";
import { LinearGradient, ImagePicker ,Permissions,Constants} from "expo";
import { connect } from "react-redux";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { ScrollView } from "react-native-gesture-handler";
import DatePicker from "react-native-datepicker";
import { Header } from "react-native-elements";
import AppText from "../components/AppText";
import Ionicons from "react-native-vector-icons/Ionicons";

class AddCarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        make: null,
        model: null,
        year: null,
        licenseLink: "",
        plateNumber: null,
        licenseExpiryDate: null,
        location: null,
        photosLink: null
      },
      errorMessage1: null,
      image: null
    };
    this.RotateValueHolder = new Animated.Value(0);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }
  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({});

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);

    Animated.timing(this.RotateValueHolder, {
      toValue: 2,
      duration: 500,
      easing: Easing.quad
    }).start();
  }
  //   handleVerification =async () => {
  //     Keyboard.dismiss()
  //     const { password } = this.state.user;
  //     const { RepeatPassword } = this.state;
  //     if (password.length < 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage1: "*password must be 8 characters or more"
  //       }));
  //       this.props.doError(true);
  //     } else {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage1: ""
  //       }));
  //     }
  //     if (password !== RepeatPassword&&password.length > 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage2: "*passwords do not match"
  //       }));
  //       this.props.doError(true);
  //     } else {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage2: ""
  //       }));
  //     }
  //     if (password === RepeatPassword && password.length >= 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         error: false,
  //         errorMessage1: "",
  //         errorMessage2: ""
  //       }));
  //       await this.props.doLogin(this.state.user)
  //       this.props.navigation.navigate("Home")
  //     }

  //   };

  componentDidUpdate = () => {
    if (this.props.error) {
      Vibration.vibrate([100]);
      this.StartImageRotateFunction();
      this.props.doError(false);
    }
  };

  AddCar = async () => {};
  handleLoading = () => {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
      outputRange: [0, -20, 0, 20, 0, -15, 0, 10, 0, -15, 0]
    });

    const labelStyle = {
      transform: [{ translateX: RotateData }]
    };
    return (
      <View style={{ width: "70%" }}>
        <Animated.View style={labelStyle}>
          <TouchableOpacity
            onPress={() => {
              this.AddCar();
            }}
          >
            <View
              style={styles.button}
              colors={["transparent", "rgba(0,0,0,0.3)"]}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: Platform.OS === "ios" ? "flex-start " : null,
                  alignItems: "center"
                }}
              >
                {!this.props.loading ? (
                  <>
                    <Text  style={{ color: "#FFF",paddingTop:10 }}>
                      Add Car
                    </Text>
                  </>
                ) : (
                  <ActivityIndicator
                    animating={this.props.loading}
                    size="large"
                    color={"#FFF"}
                    style={{ paddingTop: 7 }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  render() {
    return (
      <>
        <Header
          backgroundColor={colors.primary}
          centerComponent={
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                width: "100%",
                borderRadius: 50,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AppText style={{ color: "white" }} text={"Add Car"} />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Main")}
            >
              <Ionicons
                name={Platform.OS + "-arrow-back"}
                size={30}
                color={"#74808E"}
              />
            </TouchableOpacity>
          }
        />
        <KeyboardAvoidingView
          style={{
            backgroundColor: colors.backgroundMain,
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "stretch",
            paddingTop: 10,

          }}
          behavior="padding"
          enabled
        >
          <ScrollView
            style={{
              backgroundColor: colors.backgroundMain,
              paddingBottom: 300,
              padding:20
            }}
          >
            <FloatingLabelInput
              style={styles.text}
              label={"Car Make"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, make: text }
                }));
              }}
              value={this.state.user.make}
            />
            <FloatingLabelInput
              style={styles.text}
              label={"Car Model"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, model: text }
                }));
              }}
              value={this.state.user.model}
            />
            <FloatingLabelInput
              style={styles.text}
              label={"Year of Production"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, year: text }
                }));
              }}
              value={this.state.user.year}
              keyboardType="numeric"
            />
            <FloatingLabelInput
              style={styles.text}
              label="License Plate Number"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, plateNumber: text }
                }));
              }}
              value={this.state.user.plateNumber}
            />
            <FloatingLabelInput
              style={styles.text}
              label="Location"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, plateNumber: text }
                }));
              }}
              value={this.state.user.plateNumber}
            />

            <DatePicker
              placeholder="License Expiry Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              mode="date"
              style={{
                width: "100%",
                alignItems: "baseline"
              }}
              date={this.state.licenseExpiryDate}
              mode="date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              showIcon={false}
              customStyles={{
                dateInput: {
                  height: 50,
                  borderStyle: "solid",
                  borderColor: "#0000",

                  borderBottomColor: "#74808E",
                  borderBottomWidth: 1,
                  // borderRadius: 10,
                  marginBottom: 20,
                  fontSize: 18,
                  color: "#000",
                  fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto"
                }
              }}
              onDateChange={date_in => {
                this.setState({ licenseExpiryDate: date_in });
              }}
            />

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Button
                title="Pick an image from camera roll"
                onPress={this._pickImage}
              />
              {this.state.image && (
                <Image
                  source={{ uri: this.state.image }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
          </ScrollView>

          <StatusBar barStyle={"light-content"} />

          <View
            style={{
              padding: 30,
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {this.handleLoading()}
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}

export default AddCarScreen;

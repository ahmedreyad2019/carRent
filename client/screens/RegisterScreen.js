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
  Keyboard
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import { styles,colors } from "../styles";
import * as actions from "../actions/index";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { ScrollView } from "react-native-gesture-handler";
class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: null,
        LastName: null,
        mobileNumber: null,
        password: "",
        email:null
      },
      RepeatPassword: "",
      errorMessage1:null,
      errorMessage2:null,
      passwordMatch: true
    };
    this.RotateValueHolder = new Animated.Value(0);
  }

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);

    Animated.timing(this.RotateValueHolder, {
      toValue: 2,
      duration: 500,
      easing: Easing.quad
    }).start();
  }
  handleVerification =async () => {
    Keyboard.dismiss()
    const { password } = this.state.user;
    const { RepeatPassword } = this.state;
    if (password.length < 8) {
      this.setState(prevState => ({
        ...prevState,
        errorMessage1: "*password must be 8 characters or more"
      }));
      this.props.doError(true);
    } else {
      this.setState(prevState => ({
        ...prevState,
        errorMessage1: ""
      }));
    }
    if (password !== RepeatPassword&&password.length > 8) {
      this.setState(prevState => ({
        ...prevState,
        errorMessage2: "*passwords do not match"
      }));
      this.props.doError(true);
    } else {
      this.setState(prevState => ({
        ...prevState,
        errorMessage2: ""
      }));
    }
    if (password === RepeatPassword && password.length >= 8) {
      this.setState(prevState => ({
        ...prevState,
        error: false,
        errorMessage1: "",
        errorMessage2: ""
      }));
      await this.props.doLogin(this.state.user)
      this.props.navigation.navigate("Login")
    }
   
  };

  componentDidUpdate = () => {
    if (this.props.error) {
      Vibration.vibrate([100]);
      this.StartImageRotateFunction();
      this.props.doError(false);
    }
  };
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
              this.handleVerification();
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
                
                <Text paddingTop="10" style={{ color: "#FFF" }}>Sign Up</Text>
                </>
              ) : (
                <ActivityIndicator
                  animating={this.props.loading}
                  size="large"
                  color={"#FFF"}
                  style={{paddingTop:7}}
                />
              )}
            </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  componentWillUpdate = () => {
    if (this.props.loggedIn) {
      this.props.navigation.navigate("Dashboard");
    }
  };

  render() {
    return (
      <>
        <KeyboardAvoidingView
          style={{
            backgroundColor: colors.backgroundMain,
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "stretch",
            paddingTop:10
          }}
          behavior="padding"
          enabled
        >
          <ScrollView
            style={{
              backgroundColor: colors.backgroundMain,
              padding: 30
            }}
          >
            
            <FloatingLabelInput
                style={styles.text}
                label={"First Name"}
                onChangeText={text => {
                  this.setState(prevState => ({
                    ...prevState,
                    user: { ...prevState.user, firstName: text }
                  }));
                }}
                value={this.state.user.firstName}
              />
              <FloatingLabelInput
                style={styles.text}
                label={"Last Name"}
                onChangeText={text => {
                  this.setState(prevState => ({
                    ...prevState,
                    user: { ...prevState.user, LastName: text }
                  }));
                }}
                value={this.state.user.LastName}
              />
<FloatingLabelInput
                style={styles.text}
                label={"Email"}
                onChangeText={text => {
                  this.setState(prevState => ({
                    ...prevState,
                    user: { ...prevState.user, email: text }
                  }));
                }}
                value={this.state.user.email}
                keyboardType="email-address"
              />
            <FloatingLabelInput
              style={styles.text}
              label="Mobile Number"
              autoCapitalize={"none"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, mobileNumber: text }
                }));
              }}
              keyboardType="phone-pad"
              value={this.state.user.mobileNumber}
            />

            <>
              <>
                <Text
                  style={{ color: "#FF8080", position: "absolute", bottom: 0 }}
                >
                  {this.state.errorMessage1}
                </Text>
                <Text
                  style={{
                    color: "#FF8080",
                    position: "absolute",
                    bottom: 0
                  }}
                >
                  {this.state.errorMessage2}
                </Text>
              </>
              <FloatingLabelInput
                style={styles.text}
                label={"Password"}
                onChangeText={text => {
                  this.setState(prevState => ({
                    ...prevState,
                    user: { ...prevState.user, password: text }
                  }));
                }}
                textContentType="password"
                value={this.state.user.password}
              />
            </>
            <FloatingLabelInput
              style={styles.text}
              label={"Repeat password"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  RepeatPassword: text
                }));
              }}
              textContentType="password"
              value={this.state.RepeatPassword}
            />
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
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <Text style={{ color: "#74808E" }}>Already Have an account?</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }
}
const mapStateToProps = state =>
  ({ token, loggedIn, loading } = state.loginReducer);
const mapDispatchToProps = dispatch => ({
  doLogin: user => {
    dispatch(actions.signUp(user));
  },
  doError: error => {
    dispatch(actions.setError(error));
  },
  doClear: () => {
    dispatch(actions.clear());
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterScreen);

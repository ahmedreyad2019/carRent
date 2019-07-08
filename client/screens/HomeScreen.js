import React from "react";
import {Platform} from "react-native"
import {
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Vibration,
  StatusBar,
  ActivityIndicator,
  Animated,
  Easing
} from "react-native";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as actions from "../actions/index";
import FloatingLabelInput from "../components/FloatingLabelInput";
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
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
      <View style={{ width: "45%" }}>
        <Animated.View style={labelStyle}>
          <TouchableOpacity
            onPress={() =>
              this.props.doLogin(this.state.email, this.state.password)
            }
          >
            <View
              style={styles.button}
              colors={["transparent", "rgba(0,0,0,0.3)"]}
            >
              <View style={{ flex: 1,flexDirection:"row",justifyContent:Platform.OS === 'ios'? 'flex-start ':null,alignItems:"center"}}>
                <Text style={{flex:0.6, color: "#FFF",fontSize:22,fontFamily:Platform.OS === 'ios'? "Avenir-Black":'Roboto', }}>Sign in</Text>
                <View style={{flex:0.1}}/>
                {!this.props.loading ? (
                  <Ionicons
                    name={"ios-arrow-forward"}
                    size={25}
                    color={"#FFF"}
                  />
                ) : (
                  <ActivityIndicator
                    animating={this.props.loading}
                    size="small"
                    color={"#FFF"}
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
        <View
          style={{
            backgroundColor: colors.backgroundMain,
            flex: 1,
            padding: 30,
            paddingTop: 100
          }}
        >
          <FloatingLabelInput
            autoCapitalize={"none"}
            style={styles.text}
            label="Mobile"
            onChangeText={text => this.setState({ email: text })}
            keyboardType="phone-pad"
            value={this.state.email}
          />

          <FloatingLabelInput
            style={styles.text}
            label={"password"}
            onChangeText={text => this.setState({ password: text })}
            textContentType="password"
            value={this.state.password}
          />

          <StatusBar barStyle={"light-content"} />

          {this.handleLoading()}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Register")}
          >
            <Text style={{ color: "#74808E" }}>
              if you do not have an account, register here
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
const mapStateToProps = state =>
  ({ token, loggedIn, loading } = state.loginReducer);
const mapDispatchToProps = dispatch => ({
  doLogin: (email, password) => {
    dispatch(actions.login(email, password));
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
)(HomeScreen);

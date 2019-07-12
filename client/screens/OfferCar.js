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
  Image,
  Alert,
  AsyncStorage
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

class OfferCar extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      user: {
        location: null,
        minimumPeriod:null,
        rentingDateStart:null,
        rentingDateEnd:null,
        price:null,
        pricePerHour:null
      },
      errorMessage1: null,
      per:"Price",
      car:navigation.getParam('car'),
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

  RentCar = async () => {
    if(new Date(this.state.user.rentingDateEnd)-new Date(this.state.user.rentingDateStart)<=7200000){
        Alert.alert("Sorry, You can't offer your Car for less than 2 hours")
        return;
    }
    if(this.state.per=="Price Per Hour"){
        this.setState(prevState => ({
            ...prevState,
            user: { ...prevState.user,pricePerHour:this.state.user.price, price: null }
          }));
    }
    console.log(this.state.user)
    try{
    AsyncStorage.getItem("jwt").then(token =>
      fetch(
        `https://carrentalserver.herokuapp.com/carOwner/RentMyCar/`+this.state.car._id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          },
          body: JSON.stringify(this.state.user)

        }
      )
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if(res.data){
              console.log(res)
            Alert.alert(
              'Success',
              'Your Car is Now Up for Rent',
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate("ViewCar",{car:this.state.car})},
              ],
              {cancelable: false},
              
            );
          }
        })
        .catch(error => {
          console.log(error);
        })
      );
  }catch(error){
    console.log(error)
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
              this.RentCar();
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
                    <Text  style={{ color: "#FFF" }}>
                      Offer For Rent
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
              <AppText style={{ color: "white" }} text={"Rent My Car"} />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ViewCar")}
            >
              <Ionicons
                name={"ios" + "-arrow-back"}
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
              label="Location"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, location: text }
                }));
              }}
              value={this.state.user.location}
            />

<View style={{flexDirection:"row"}}>
            <DatePicker
              placeholder="Start Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              mode="date"
              style={{
                width: "45%",
                
              }}
              date={this.state.user.rentingDateStart}
              mode="datetime"
            
              minDate="2019-07-07"
              showIcon={true}
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
                this.setState(prevState => ({  ...prevState,
                  user: { ...prevState.user, rentingDateStart: date_in }}));
                  if(this.state.user.rentingDateStart&&this.state.user.rentingDateEnd&&(new Date(this.state.user.rentingDateEnd)-new Date(this.state.user.rentingDateStart)<=172800000))
          this.setState({per:"Price Per Hour"})
      else
        this.setState({per:"Price Per Day"})
              }}
            />

<Ionicons name="ios-arrow-round-forward"  size={40}
                color={colors.primary}/>

<DatePicker
              placeholder="End Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              mode="date"
              style={{
                width: "45%",
               
              }}
              date={this.state.user.rentingDateEnd}
              mode="datetime"
              
              minDate="2019-07-07"
              showIcon={true}
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
                this.setState(prevState => ({  ...prevState,
                  user: { ...prevState.user, rentingDateEnd: date_in }}));
                  console.log(this.state.user.rentingDateEnd)
                  console.log(this.state.user.rentingDateStart)
                  console.log(new Date(this.state.user.rentingDateEnd.replace(/-/g,'/'))-new Date(this.state.user.rentingDateStart.replace(/-/g,'/')))
                  if(this.state.user.rentingDateStart&&this.state.user.rentingDateEnd&&(new Date(this.state.user.rentingDateEnd.replace(/-/g,'/'))-new Date(this.state.user.rentingDateStart.replace(/-/g,'/'))<=172800000))
          this.setState({per:"Price Per Hour"})
      else
        this.setState({per:"Price Per Day"})
              }}
            />

   
</View>

<FloatingLabelInput
              style={styles.text}
              label={"Minimum Rent Period in Days"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, minimumPeriod: text }
                }));
              }}
              value={this.state.user.minimumPeriod}
              keyboardType="numeric"
            />

<FloatingLabelInput
              style={styles.text}
              label={this.state.per}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, price: text }
                }));
              }}
              value={this.state.user.price}
              keyboardType="numeric"
            />
     
     

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
          </ScrollView>
        </KeyboardAvoidingView>
      </>
    );
  }
}

export default OfferCar;

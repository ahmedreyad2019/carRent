import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  RefreshControl,
  StatusBar,
  FlatList,
  Platform,
  AsyncStorage
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Detail from "../components/Detail";
import AppText from "../components/AppText";
import { Header, ButtonGroup } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";
import Rating from "../components/Rating";
import { LinearGradient } from 'expo';

class MyCarTransactionScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      car:navigation.getParam('car'),
      transaction:navigation.getParam('transaction'),
    };
  }

  deleteTransaction =()=>{
          try{
    AsyncStorage.getItem("jwt").then(token =>
      fetch(
        `https://carrentalserver.herokuapp.com/carOwner/UnPublishMyCar/`+this.state.transaction.transaction._id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }

        }
      )
        .then(res => res.json())
        .then(res => {
          console.log(JSON.stringify(res.msg))
          if(res.data){
            Alert.alert(
              'Period Removed',
              'Your Car has been addded successfully, you will recieve a response within 48 hours.',
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate("Main")},
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
  }

  getTimeString = date => {
    var today = new Date(date);
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  getdateString = (date, hi) => {
    var today = new Date(date);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var year = today
      .getFullYear()
      .toLocaleString()
      .substring(3);
    var month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    if (hi) {
      return (
        today.getDate() +
        " " +
        month[today.getMonth()] +
        ", " +
        this.getTimeString(date)
      );
    }

    return today.getDate() + "/" + (today.getMonth() + 1);
  };
  render() {
  console.log(this.state.transaction)
    return (
      <View style={{ flex: 1 }}>
        <Header
          barStyle={"light-content"}
          backgroundColor={colors.primary}
          centerComponent={
            <AppText size={24} style={{ color: "white" }} text={"Details"} />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("ViewCar")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <View
          style={{
            borderBottomWidth: 0.3,
            borderBottomColor: "#ddd",
            paddingHorizontal: 40,
            paddingVertical: 20,
            justifyContent: "center",
            alignItems: "stretch",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <AppText
              fontStyle={"bold"}
              size={20}
              text={this.state.transaction.carRenter?this.state.transaction.carRenter.firstName + " " + this.state.transaction.carRenter.lastName:""}
            />
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {this.state.transaction.carRenter?  <Rating size={25} rating={this.state.transaction.carRenter.rating} />:<></>}
              <AppText
                text={this.state.transaction.carRenter?"avg":""}
                fontStyle={"light"}
                size={10}
                style={{ color: "#888" }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <AppText text={this.state.car.make + " " + this.state.car.model} />
                <AppText
                  fontStyle={"light"}
                  size={12}
                  text={" " + this.state.car.year}
                  style={{ color: "#888" }}
                />
              </View>
              <AppText
                size={12}
                text={this.state.car.plateNumber}
                style={{ color: "#888" }}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Rating size={25} rating={this.state.car.rating} />
              <AppText
                text={"avg"}
                fontStyle={"light"}
                size={10}
                style={{ color: "#888" }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 0.3,
            borderBottomColor: "#ddd",
            paddingHorizontal: 40,
            paddingVertical: 20,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}
        />
        <AppText text={"EGP " + this.state.transaction.transaction.price} />

        {this.state.transaction.transaction.status=="UpForRent"&&<View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eeeeee",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20,
            
          }}
        >
             <LinearGradient
                  colors={["#FF6347", "#FF0000"]}
           style={{justifyContent:"center",alignItems:"center",width:"100%",  height: 50}}
           
          >
          <TouchableOpacity
            onPress={() => {
                if(this.state.transaction.transaction.status=="UpForRent"){
                    //Delete Transaction
                   this.deleteTransaction()
                }
            }}
          >
                 
            <Text
              style={{
                fontSize: 20,
                fontFamily:   Platform.OS === "ios" ? "AvenirNext-DemiBold":"Roboto",
                color: "white"
              }}
            >
              {"Remove This Renting Period"}
            </Text>
            {this.props.loading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
            </LinearGradient>
        </View>}
      </View>
    );
  }
}


export default (MyCarTransactionScreen);

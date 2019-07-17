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
            onPress={() => this.props.navigation.navigate("Transaction")}
          >
            <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1 }}>
        <ImageCarousel images={this.state.car.photosLink} full={true} />
        <View
          style={{
            borderBottomWidth: 0.3,
            borderBottomColor: "#ddd",
            paddingHorizontal: 30,
            paddingVertical: 20,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          {this.state.transaction.transaction.status!="UpForRent"&&<View
            style={{
              flexDirection: "column",
              alignItems: "baseline",
              justifyContent: "flex-start"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "flex-start"
              }}
            >
              <AppText
                fontStyle={"bold"}
                size={18}
                text={this.state.transaction.carRenter.firstName + " " + this.state.transaction.carRenter.lastName}
              />
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Ionicons
                  name={"md" + "-star-outline"}
                  size={15}
                  style={{ marginLeft: 5, marginRight: 3 }}
                />

                <AppText
                  text={(this.state.transaction.carRenter.rating ? this.state.transaction.carRenter.rating : 5).toFixed(1)}
                  fontStyle={"light"}
                  size={10}
                  style={{ color: "#888" }}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() => Linking.openURL(`tel:${this.state.transaction.carRenter.mobileNumber}`)}
              onLongPress={async () =>
                await Clipboard.setString(
                  this.state.transaction.carRenter.mobileNumber,
                  Alert.alert("Number copied")
                )
              }
            >
              <Ionicons name={"ios" + "-call"} size={15} />
              <AppText
                text={this.state.transaction.carRenter.mobileNumber}
                style={{ color: "#888", marginHorizontal: 5 }}
                size={12}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start"
              }}
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={() => Linking.openURL(`mailto:${this.state.transaction.carRenter.email}`)}
              onLongPress={async () =>
                await Clipboard.setString(
                  this.state.transaction.carRenter.email,
                  Alert.alert("Email copied")
                )
              }
            >
              <Ionicons name={"ios" + "-mail"} size={15} />
              <AppText
                text={this.state.transaction.carRenter.email}
                style={{ color: "#888", marginHorizontal: 5 }}
                size={12}
              />
            </TouchableOpacity>
          </View>}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                }}
              >
                <AppText text={this.state.car.make} />
                <View
                  style={{ flexDirection: "row", alignItems: "baseline" }}
                >
                  <AppText text={this.state.car.model} />
                  <AppText
                    fontStyle={"light"}
                    size={12}
                    text={" " + this.state.car.year}
                    style={{ color: "#888" }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <AppText
                  size={12}
                  text={this.state.car.plateNumber}
                  style={{ color: "#888" }}
                />
                <Ionicons
                  name={"md" + "-star-outline"}
                  size={15}
                  style={{ marginLeft: 10, marginRight: 3 }}
                />

                <AppText
                  text={this.state.car.rating.toFixed(1)}
                  fontStyle={"light"}
                  size={10}
                  style={{ color: "#888" }}
                />
              </View>
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
            alignItems: "stretch"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Ionicons
                name={"ios" + "-pin"}
                size={20}
                style={{ marginRight: 5 }}
              />

              <AppText text={this.state.transaction.transaction.location} size={18} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LinearGradient
                colors={["transparent", "#123"]}
                style={{
                  width: 5,
                  borderRadius: 2,
                  backgroundColor: "#59b",
                  height: 30,
                  marginRight: 5
                }}
              />

              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <AppText
                  text={this.getdateString(
                    this.state.transaction.transaction.rentingDateStart,
                    true
                  )}
                />

                <AppText
                  text={this.getdateString(this.state.transaction.transaction.rentingDateEnd, true)}
                />
              </View>
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
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <AppText text={"Price per day"} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AppText style={{ color: "#888" }} size={16} text={"EGP "} />
              <AppText
                size={20}
                fontStyle={"bold"}
                text={this.state.transaction.transaction.price.toLocaleString()}
              />
            </View>
          </View>
        </View>
      </ScrollView>

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

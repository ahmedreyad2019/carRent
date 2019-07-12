import { connect } from "react-redux";
import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  Platform,
  AsyncStorage,
  FlatList
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles, colors } from "../styles";
import * as actions from "../actions/index";
import Rating from "../components/Rating";

import AppText from "../components/AppText";
import { Header } from "react-native-elements";
import ImageCarousel from "../components/ImageCarousel";
import Detail from "../components/Detail";

class MyCarDetailsScreen extends React.Component {
    
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      iconName: "ios-arrow-up",
      order: "asc",
      keys: [],
      selectedKey: "",
      car:navigation.getParam('car'),
      transactions:null
    };
  }
  getdateString = (date, year) => {
    var today = new Date(date);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    return (
      today.getDate() +
      "/" +
      (today.getMonth() + 1) +
      (year ? "/" + today.getFullYear() : "")
    );
  };

  componentDidMount(){
    AsyncStorage.getItem("jwt").then(token =>
        fetch(
          `https://carrentalserver.herokuapp.com/carOwner/AllRents/`+this.state.car._id,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token
            }
          }
        )
          .then(response => response.json())
          .then(response => {
            this.setState({transactions:response.data})
            console.log(this.state.transactions)
          })
          .catch(error => {
            console.log(error);
            dispatch(setError(error));
          })
      );
    };
  
  render() {
    // const { selectedCar } = this.props;
    // const transaction = selectedCar;
    // const car = selectedCar.cars[0];
    // date1 = new Date(transaction.rentingDateStart);
    // date2 = new Date(transaction.rentingDateEnd);
    // const diffTime = Math.abs(date2.getTime() - date1.getTime());
    // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // const images = [
    //   "../images/bmw-3-series-render.jpg",
    //   "../images/bmw-4-series-render.jpg",
    //   "../images/bmw-5-series-render.jpg"
    // ];
    return (
      <View
        style={{ flexDirection: "column", justifyContent: "center", flex: 1 }}
      >
        <Header
          backgroundColor={colors.primary}
          centerComponent={
            <AppText
              size={24}
              style={{ color: "white" }}
              text={this.state.car.make + " " + this.state.car.model}
            />
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Cars")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <ScrollView>
          <ImageCarousel images={this.state.car.photosLink} full={400} />

          <View style={{ marginHorizontal: 10 }}>
           
            <Detail data={this.state.car.rating + "/5"} field={"Rating"} />
            <Text
              style={{
                color: colors.primary,
                fontSize: 28,
                fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
              }}
            >
              Transactions
            </Text>

            {/* <Detail
              data={this.getdateString(transaction.rentingDateStart, true)}
              field={"Renting start date"}
            />
            <Detail
              data={this.getdateString(transaction.rentingDateEnd, true)}
              field={"Renting end date"}
            /> */}
          </View>
        </ScrollView>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#eeeeee",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 20
          }}
        >
<FlatList
        //   refreshControl={
        //     <RefreshControl
        //       refreshing={this.props.loading}
        //       onRefresh={this._onRefresh}
        //     />
        //   }
          data={
            this.state.transactions
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
               // this.props.navigation.navigate("TransactionDetails")
              }}
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: "#ddd",
                height: 120
              }}
            >
              <AppText
                text={"EGP " + item.price}
                style={{ position: "absolute", right: 15, top: 15 }}
              />
              
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  left: 15,
                  top: 15
                }}
              >
                <AppText
                  text={this.getdateString(item.rentingDateStart, true)}
                />
                <View
                  style={{
                    borderRightWidth: 2,
                    borderRightColor: "#aaa",
                    height: 10
                  }}
                />
                <AppText text={this.getdateString(item.rentingDateEnd, true)} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => {
            return item._id;
          }}
        />
          <TouchableOpacity
            onPress={() => {
                if(this.state.car.status!="PendingApproval"&&this.state.car.status!="Rejected"){
                    //Redirect to Rent screen
                    this.props.navigation.navigate("RentCar",{'car':this.state.car})

                }
            }}
            style={{
              backgroundColor: colors.primary,
              flexDirection: "row",
              justifyContent: "center",
              height: 50,
              width: "100%",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily:   Platform.OS === "ios" ? "AvenirNext-DemiBold":"Roboto",
                color: "white"
              }}
            >
              {this.state.car.status=="PendingApproval"?"This Car is still waiting for approval":this.state.car.status=="Rejected"?"This Car is Rejected":"Offer for Rent"}
            </Text>
            {this.props.loading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default (MyCarDetailsScreen);

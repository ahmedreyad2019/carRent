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
import { LinearGradient } from "expo";
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
              console.log(this.state.car._id)
            console.log(response)
            this.setState({transactions:response.data})
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
              onPress={() => this.props.navigation.navigate("Main")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        <ScrollView>
          <ImageCarousel images={this.state.car.photosLink} full={400} />

          <View style={{ marginHorizontal: 10 }}>
           
           { this.state.transactions&&<Detail data={this.state.car.rating + "/5"} field={"Rating"} />}
            {this.state.transactions&&<Text
              style={{
                color: colors.primary,
                fontSize: 28,
                fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
              }}
            >
              Transactions
            </Text>}
           {this.state.car.status=="Rejected"&& <Text
              style={{
                color: colors.primary,
                fontSize: 20,
                fontFamily: Platform.OS === "ios" ? "AvenirNext-Bold" : "Roboto"
              }}
            >
              {"Reason of Rejection: "+this.state.car.comment}
            </Text>}
            {/* <Detail
              data={this.getdateString(transaction.rentingDateStart, true)}
              field={"Renting start date"}
            />
            <Detail
              data={this.getdateString(transaction.rentingDateEnd, true)}
              field={"Renting end date"}
            /> */}
          </View>
       
     {/* {this.state.transactions} */}
<FlatList
         snapToInterval={240}
         bouncesZoom
         indicatorStyle={"white"}
         snapToAlignment={"start"}
         decelerationRate="fast"
         data={this.state.transactions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Transaction",{car:this.state.car,transaction:item})
               console.log("k")
              }}
              style={{
                marginHorizontal: 10,
                marginVertical: 15,
                flexDirection: "column",
                borderBottomColor: "#ddd",
                height: 120,
                backgroundColor: "white",
                borderRadius: 15,
                shadowOpacity: 0.2,
                shadowRadius: 15,
                elevation: 20
              }}
            >
              <AppText
                size={13}
                text={item.transaction.price.toLocaleString() + " EGP"}
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  bottom: 10
                }}
              />
              <View
                style={{
                  position: "absolute",
                  right: 15,
                  top: 15,
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                <AppText
                  size={14}
                  fontStyle={"bold"}
                  text={this.state.car.make}
                  style={{
                    color: colors.primary
                  }}
                />
                <AppText
                  size={20}
                  fontStyle={"bold"}
                  text={this.state.car.model}
                  style={{
                    color: colors.primary
                  }}
                />
                <AppText
                  size={13}
                  text={
                 item.carRenter?   item.carRenter.firstName + " " + item.carRenter.lastName:""
                  }
                  style={{
                    color: "#888"
                  }}
                />
              </View>
              <AppText
                size={13}
                text={item.transaction.status}
                style={{ position: "absolute", right: 15, bottom: 10 }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: 15,
                  top: 15
                }}
              >
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
                    alignItems: "center"
                  }}
                >
                  <AppText
                    text={this.getdateString(item.transaction.rentingDateStart, true)}
                  />

                  <AppText
                    text={this.getdateString(item.transaction.rentingDateEnd, true)}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  position: "absolute",
                  left: 15,
                  bottom: 10
                }}
              >
                <Ionicons
                  name={"ios" + "-pin"}
                  size={15}
                  style={{ marginRight: 5 }}
                />

                <AppText text={item.transaction.location} size={15} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => {
            return item.transaction._id;
          }}
        />
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
              {this.state.car.status=="PendingApproval"?"This Car is still waiting for approval":this.state.car.status=="Rejected"?"This Car is Rejected ":"Offer for Rent"}
            </Text>
            {this.props.loading ? (
              <ActivityIndicator animating={true} />
            ) : (
              <></>
            )}
          </TouchableOpacity>
        </View>
         </ScrollView>
      </View>
    );
  }
}

export default (MyCarDetailsScreen);

import React from "react";
import {
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Modal,
  ImageBackground,
  View,Platform,
  AsyncStorage
} from "react-native";
import { Header, Image } from "react-native-elements";
import Filter from "../components/Filter";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import CompanyDetials from "../components/CompanyDetails";
import SearchModal from "../components/SearchModal";
import Rating from "../components/Rating";
import AppText from "../components/AppText";
import ImageCarousel from "../components/ImageCarousel";

class OwnedCarsScreen extends React.Component {
  componentDidMount() {

    AsyncStorage.getItem("jwt").then(token =>
        fetch(`https://carrentalserver.herokuapp.com/carOwner/myCars`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        })
          .then(response => response.json())
          .then(response => {
            console.log(response.data)
           this.setState({data:response.data,loading:false})
          })
          .catch(error => {
            console.log(error)
           
          }));
    //Request
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
    };
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
        month[today.getMonth()] +
        " " +
        today.getDate() +
        ", " +
        year +
        " " +
        this.getTimeString(date)
      );
    }

    return today.getDate() + "/" + (today.getMonth() + 1);
  };


  handleDelete =async (id,make) =>{


    Alert.alert(
        'Are You Sure?',
        'Do you want to delete your '+make+" Car?",
        [
          {
            text: 'No',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Yes', onPress: () => {
              
            AsyncStorage.getItem("jwt").then(token =>
                fetch("https://carrentalserver.herokuapp.com/carOwner/MyCar/"+id, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    "x-access-token":token
                  }
                }).then(response => {
                  response.json().then(data => {
                      this._onRefresh()
                  });
                })
              );

            
          }},
        ],
        {cancelable: false},
      );


  }

  _onRefresh = () => {
    AsyncStorage.getItem("jwt").then(token =>
        fetch(`https://carrentalserver.herokuapp.com/carOwner/myCars`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          }
        })
          .then(response => response.json())
          .then(response => {
            console.log(response.data)
           this.setState({data:response.data,loading:false})
          })
          .catch(error => {
            console.log(error)
           
          }));
  };
  render() {
  
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
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
              <AppText
                style={{ color: "white" }}
                text={
                    "Your Cars"
                }
              />
            </View>
          }
          rightComponent={
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate("AddCar")}
          >
            <Ionicons name={"md-add"} size={30} color={"#74808E"} />
          </TouchableOpacity>
          }
          
        />

      

      

        <ScrollView
        bounces={false}
          bouncesZoom={true}
          pagingEnabled={true}
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: colors.backgroundMain
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this._onRefresh}
            />
          }
        >
          <StatusBar barStyle={"light-content"} />
          <>
            <View>
              {this.state.data === 0 && !this.props.loading ? (
                <AppText
                  style={{ alignSelf: "center" }}
                  text={
                    "You Have No Registered Cars."
                  }
                />
              ) : (
                <FlatList
                  snapToInterval={240}
                  bouncesZoom
                  indicatorStyle={"white"}
                  snapToAlignment={"start"}
                  decelerationRate="fast"
                  data={this.state.data}
                  renderItem={({ item }) => (
                    <View
                      colors={["transparent", "rgba(0,0,0,0.2)"]}
                      style={{
                        ...styles.carCard
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            item.status == "Idle"||item.status =="idle" ? colors.primary : item.status=="UpForRent"? "green":item.status=="PendingApproval"?"#d3d3d3":item.status=="Rented"?"#add8e6":"#FF0000",
                          zIndex: 9090909090,
                          width: 150,
                          height: 30,
                          position: "absolute",
                          top: 25,
                          right: 25,
                          borderRadius: 50,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onPress={() => {
                        //   this.props.doSetCar(item),
                             this.props.navigation.navigate("ViewCar",{'car':item});
                        }}
                      >
                        <AppText
                          fontStyle={"bold"}
                          size={14}
                          style={{
                            color: "white"
                          }}
                          text={item.status=="PendingApproval"?"Pending Approval":item.status=="UpForRent"?"Up For Rent":item.status}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "white",
                          zIndex: 9090909090,
                          width: 100,
                          height: 65,
                          position: "absolute",
                          top: 150,
                          right: 20,
                          borderBottomLeftRadius: 15,
                          borderTopLeftRadius: 15,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center"
                          
                        }}
                        onPress={() => {
                          this.handleDelete(item._id,item.make)
                            }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                            <AppText
                          fontStyle={"italic"}
                          size={14}
                     
                          text={"Remove Car"}
                        />
                        </View>
                      </TouchableOpacity>
                      <ImageCarousel images={item.photosLink} />

                      <View
                        style={{
                          height: 60,
                          width: "100%",
                          paddingLeft: 5,
                          alignItems: "flex-start"
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "baseline"
                          }}
                        >
                          <AppText
                            fontStyle={"bold"}
                            size={23}
                            style={{
                              color: colors.primary
                            }}
                            text={item.make + " " + item.model}
                          />
                          <AppText
                            size={12}
                            style={{
                              color: colors.primary,
                              fontFamily: Platform.OS==='ios'? "AvenirNext-DemiBold":'Roboto',
                              opacity: 0.7
                            }}
                            text={" " + item.year}
                          />
                        </View>
                        <Rating rating={item.rating} />
                      </View>
      
                    </View>
                  )}
                  keyExtractor={item => {
                    return item._id;
                  }}
                />
              )}
            </View>
          </>
        </ScrollView>
      </View>
    );
  }
}


export default OwnedCarsScreen;

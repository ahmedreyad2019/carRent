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
import ImageCarousel from "../components/ImageCarousel";
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
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Maps from "../MapStyle";
class ChooseLocMap extends React.Component {
    constructor(props) {
      super(props);
      const { navigation } = this.props;
      this.state = {      
          location: navigation.getParam("transaction").location,
          rentingDateStart:navigation.getParam("transaction").rentingDateStart,
          rentingDateEnd:navigation.getParam("transaction").rentingDateEnd,
          price:navigation.getParam("transaction").price,
          pricePerHour:navigation.getParam("transaction").pricePerHour,
          flexible:null,
          coordinate:null,
        
      };
      this.RotateValueHolder = new Animated.Value(0);
    }
  
    componentWillMount() {
      
          this._getLocationAsync();
      }
      _getLocationAsync = async () => { 
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          this.setState({
            errorMessage: 'Permission to access location was denied',
          });
          this.setState({coordinate:{
            "accuracy": 1000,
            "altitude": 0,
            "heading": 0,
            "latitude": 30.0719278,
            "longitude": 31.438297,
            "speed": 0
        }})
        }
    try{
        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        this.setState({ coordinate:location.coords});
    }catch(error){
        console.log(error)
        this.setState({coordinate:{
            "accuracy": 1000,
            "altitude": 0,
            "heading": 0,
            "latitude": 30.0719278,
            "longitude": 31.438297,
            "speed": 0
        }})
    }
      };
    
    
    componentDidMount() {
     
    }
    AddLoc=()=>{
            error=false;
           
            console.log(this.state)
        if(!error){
             Alert.alert(
              'Is this Offering Flexible?',
              'Pressing No means that this car can be rented only as a bulk from the dates you entered and cannot be partioned.',
              [
                {
                  text: 'Cancel',
                  style:"cancel"
                },
                {
                  text: 'No',
                  onPress: () => {  this.setState({flexible: false }
                  ); },
                },
                {text: 'Yes', onPress: () => {  this.setState({flexible: true });
                this.sendRequest()}},
              ],
            );
          
          };
        

        //this.props.navigation.navigate("AddCar",{location:this.state.location})
    }
    sendRequest= ()=>{
        try{
          AsyncStorage.getItem("jwt").then(token =>
            fetch(
              `https://carrentalserver.herokuapp.com/carOwner/RentMyCar/`+this.props.navigation.getParam('car')._id,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": token
                },
                body: JSON.stringify(this.state)
      
              }
            )
              .then(res => res.json())
              .then(res => {
                console.log(this.state)
                console.log(res)
                if(res.data){
                    console.log(res)
                  Alert.alert(
                    'Success',
                    'Your Car is Now Up for Rent',
                    [
                      {text: 'OK', onPress: () => this.props.navigation.navigate("ViewCar",{car:this.props.navigation.getParam('car')})},
                    ],
                    {cancelable: false},
                    
                  );
                }else{
                  alert(res.message)
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
    render() {

        return (
            <View style={{ flex: 1 }}>
    {this.state.coordinate&&<MapView
    style={{ flex: 1 }}
    initialRegion={{
      latitude: this.state.coordinate.latitude,
      longitude: this.state.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    onRegionChange={(region) => {this.setState({coordinate:region})}}
    customMapStyle={Maps}
 >
     <Marker
        coordinate={this.state.coordinate}
      
     >
         <Image   source={{ uri: "https://downloadpng.com/wp-content/uploads/thenext-thumb-cache//car-png-icon-c6b4f4d3eb48cc3e1431e0e1fbebeb6d-900x0.png" }} style={{height: 55, width:55 }}></Image>
     </Marker>
     </MapView>}

     <View
        style={{
            position: 'absolute',//use absolute position to show button on top of the map
            bottom: '3%', //for center align
            alignSelf: 'center' //for align to right
        }}
    >
        
        <Button
                title="Confirm Car Pickup location"
               onPress={this.AddLoc}
                styles={{paddingTop:10}}
              />
    </View>


    <View
        style={{
            position: 'absolute',//use absolute position to show button on top of the map
            top: '3%', //for center align
            alignSelf: 'flex-start', //for align to right
            padding:15
        }}
    >
        <TouchableOpacity
              onPress={() => this.props.navigation.navigate("RentCar")}
              
            >
    <Ionicons
                name={"ios-arrow-back"}
                size={30}
                color={"#74808E"}
              />
              </TouchableOpacity>
    </View>
   
  </View>)}
}
export default ChooseLocMap
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
          coordinate:{
            "accuracy": 1000,
            "altitude": 0,
            "heading": 0,
            "latitude": 30.0719278,
            "longitude": 31.438297,
            "speed": 0
        }
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
        }
    
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ coordinate:location });
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
                  onPress: () => {  this.setState(prevState => ({
                    ...prevState,
                    user: { ...prevState.user, flexible: false }
                  })); this.sendRequest()},
                },
                {text: 'Yes', onPress: () => {  this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, flexible: true }
                }));this.sendRequest()}},
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
    <MapView
    style={{ flex: 1 }}
    initialRegion={{
      latitude: this.state.coordinate.latitude,
      longitude: this.state.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    onRegionChange={(region) => {this.setState({coordinate:region})}}
    customMapStyle={[
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]}
 >
     <Marker
        coordinate={this.state.coordinate}
      
     >
         <Image   source={{ uri: "https://downloadpng.com/wp-content/uploads/thenext-thumb-cache//car-png-icon-c6b4f4d3eb48cc3e1431e0e1fbebeb6d-900x0.png" }} style={{height: 55, width:55 }}></Image>
     </Marker>
     </MapView>

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
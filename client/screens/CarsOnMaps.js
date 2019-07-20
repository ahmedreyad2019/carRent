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
  View,
  Platform
} from "react-native";
import { LinearGradient, ImagePicker ,Permissions,Constants} from "expo";
import { Header, Image } from "react-native-elements";
import Filter from "../components/Filter";
import RentScreen from "../screens/RentScreen";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Maps from "../MapStyle";
import Rating from "../components/Rating";
import AppText from "../components/AppText";
import ImageCarousel from "../components/ImageCarousel";

class CarsOnMaps extends React.Component {
  componentDidMount() {}

  constructor(props) {
    super(props);
    this.state = {
      investor: null,
      loading: true,
      hi: false,
      refresh: false,
      data: [],
      coordinate:null,
    };
  }
  _onRefresh = () => {
    this.props.doFetchCars(this.props.search);
  };

    
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
 
  this.setState({ coordinate:location.coords});
  console.log(this.state.coordinate)
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
    {this.props.cars&&this.props.cars.map(marker => (
    marker.coordinate&&<Marker
      coordinate={marker.coordinate}
      title={marker.cars.make}
      description={marker.cars.model}
      
    >
       <Image   source={{ uri: "https://downloadpng.com/wp-content/uploads/thenext-thumb-cache//car-png-icon-c6b4f4d3eb48cc3e1431e0e1fbebeb6d-900x0.png" }} style={{height: 55, width:55 }}></Image>
     </Marker>
  ))}
        
     </MapView>}
     </View>
 
    );
  }
}
const mapStateToProps = state => {
  return {
    cars: state.carReducer.cars,
    loading: state.loginReducer.loading,
    companyModalVisible: state.carReducer.companyModalVisible,
    searchModalVisible: state.carReducer.searchModalVisible,
    source: state.carReducer.source,
    filterModalVisible: state.carReducer.filterModalVisible,
    search: state.carReducer.search,
    rentModalVisible: state.carReducer.rentModalVisible
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchCars: search => {
    dispatch(actions.fetchCars(search));
  },
  doRent: carID => {
    dispatch(actions.rent(carID));
  },
  doOpenFilterModal: () => {
    dispatch(actions.openFilterModal());
  },
  doOpenRentModal: () => {
    dispatch(actions.openRentModal());
  },
  doSetCar: car => {
    dispatch(actions.selectCar(car));
  },

  doOpenSearchModal: () => {
    dispatch(actions.openSearchModal());
  },
  doSetSource: source => {
    dispatch(actions.setSource(source));
  }
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CarsOnMaps);

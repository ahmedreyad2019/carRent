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
import { LinearGradient, ImagePicker, Permissions, Constants } from "expo";
import { Header, Image } from "react-native-elements";
import Filter from "../components/Filter";
import RentScreen from "../screens/RentScreen";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import MapView, { PROVIDER_GOOGLE, LocalTile, UrlTile } from "react-native-maps";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Maps from "../MapStyle";
import Rating from "../components/Rating";
import AppText from "../components/AppText";
import ImageCarousel from "../components/ImageCarousel";
import Locations from "../components/Locations.json";

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
      coordinate: null
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
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
      this.setState({
        coordinate: {
          accuracy: 1000,
          altitude: 0,
          heading: 0,
          latitude: Locations.filter(
            item => item.location === this.props.search.location
          ).latitude,
          longitude: 31.438297,
          speed: 0
        }
      });
    }
    try {
      let location = await Location.getCurrentPositionAsync({});

      this.setState(
        {
          coordinate: {
            ...location.coords,
            latitude: Locations.filter(
              item => item.location === this.props.search.location
            )[0].latitude,
            longitude: Locations.filter(
              item => item.location === this.props.search.location
            )[0].longitude
          }
        },
        console.log(
          Locations.filter(item => item.location === this.props.search.location)
            .latitude
        )
      );
      console.log(
        Locations.filter(item => item.location === this.props.search.location)
      );
    } catch (error) {
      console.log(error);
      this.setState({
        coordinate: {
          accuracy: 1000,
          altitude: 0,
          heading: 0,
          latitude: Locations.filter(
            item => item.location === this.props.search.location
          ).latitude,
          longitude: 31.438297,
          speed: 0
        }
      });
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
                  (this.props.search.make !== "Any"
                    ? this.props.search.make + " " + this.props.search.model
                    : "Any cars") +
                  " in " +
                  this.props.search.location
                }
              />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Cars")}
            >
              <Ionicons name={"ios-arrow-back"} size={25} color={"#74808E"} />
            </TouchableOpacity>
          }
        />
        {this.state.coordinate && (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: this.state.coordinate.latitude,
              longitude: this.state.coordinate.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            onRegionChange={region => {
              this.setState({ coordinate: region });
            }}
            customMapStyle={Maps}
          >
            <UrlTile
    /**
     * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
     * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
     */
    urlTemplate={this.state.urlTemplate}
    /**
     * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
     * MKTileOverlay. iOS only.
     */
    maximumZ={19}
    /**
     * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
     * to be used. Its default value is false.
     */
    flipY={false}
  />
            {this.props.cars &&
              this.props.cars.map(
                marker =>
                  marker.coordinate && (
                    <Marker
                      onPress={() => {
                        this.props.doSetCar(marker),
                          this.props.navigation.navigate("Rent", {
                            prev: "MapCars"
                          });
                      }}
                      coordinate={marker.coordinate}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "column",
                          justifyContent: "space-around",
                          alignItems: "flex-start",
                          height: 70,
                          backgroundColor: "white",
                          elevation: 5,
                          shadowOpacity: 0.4,
                          shadowRadius: 5,
                          borderRadius: 10,
                          padding: 5,
                          shadowOffset: { height: 10 }
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-start"
                          }}
                        >
                          <AppText size={12} text={marker.cars.make} />
                          <AppText size={12} text={marker.cars.model} />
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <AppText
                              fontStyle={"italic"}
                              size={12}
                              text={marker.price.toLocaleString()}
                            />
                            <AppText text={"EGP"} size={10} />
                          </View>
                        </View>
                        <View
                          style={{
                            width: 0,
                            height: 0,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderLeftWidth: 7,
                            borderRightWidth: 7,
                            borderBottomWidth: 7,
                            borderLeftColor: "transparent",
                            borderRightColor: "transparent",
                            borderBottomColor: "white",
                            transform: [{ rotate: "180deg" }],
                            position: "absolute",
                            bottom: -6,
                            left: 20
                          }}
                        />
                      </TouchableOpacity>
                      <Image
                        source={{
                          uri:
                            "https://downloadpng.com/wp-content/uploads/thenext-thumb-cache//car-png-icon-c6b4f4d3eb48cc3e1431e0e1fbebeb6d-900x0.png"
                        }}
                        style={{ height: 55, width: 55 }}
                      />
                    </Marker>
                  )
              )}
          </MapView>
        )}
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

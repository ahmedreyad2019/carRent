import React from "react";
import {
  ScrollView,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Text,
  StatusBar,
  Modal,
  View
} from "react-native";
import { Header } from "react-native-elements";
import Filter from "../components/Filter";
import { styles, colors } from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo";
import { connect } from "react-redux";
import * as actions from "../actions/index";
import CompanyDetials from "../components/CompanyDetails";
import SearchModal from "../components/SearchModal";
import Rating from "../components/Rating";

class CarsScreen extends React.Component {
  componentDidMount() {
    this.props.doFetchCars();
  }

  constructor(props) {
    super(props);
    this.state = {
      investor: null,
      loading: true,
      hi: false,
      refresh: false,
      data: []
    };
  }
  _onRefresh = () => {
    this.props.doFetchCars();
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.backgroundMain }}>
        <Header
          backgroundColor={colors.primary}
          rightComponent={
            <Ionicons
              name={"ios-search"}
              onPress={() => (
                this.props.doOpenSearchModal(),
                this.props.doSetSource("FeedScreen")
              )}
              size={20}
              color={"#74808E"}
            />
          }
          leftComponent={
            <Ionicons
              name={"ios-arrow-back"}
              onPress={() => (
                this.props.navigation.navigate("Profile"),
                this.props.doSetSource("FeedScreen")
              )}
              size={20}
              color={"#74808E"}
            />
          }
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.searchModalVisible}
          key={2}
        >
          <SearchModal key={4} />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.filterModalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <Filter />
        </Modal>
        <View
          style={{
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            borderBottomColor: "#cccccc",
            borderBottomWidth: 1,
            backgroundColor: "white"
          }}
        >
          <TouchableOpacity
            onPress={() => this.props.doOpenFilterModal()}
            style={{ flexDirection: "row" }}
          >
            <Text>{"Filter "}</Text>
            <Ionicons name={"ios-options"} size={20} color={"black"} />
          </TouchableOpacity>
          <View
            style={{
              borderRightColor: "#cccccc",
              borderRightWidth: 1,
              height: "100%"
            }}
          />
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <Text>{"Map "}</Text>
            <Ionicons name={"ios-pin"} size={20} color={"black"} />
          </TouchableOpacity>
        </View>

        <ScrollView
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
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }
        >
          <StatusBar barStyle={"light-content"} />
          <>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.props.companyModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <CompanyDetials />
            </Modal>
            <View>
              <FlatList
                snapToInterval={240}
                bouncesZoom
                indicatorStyle={"white"}
                snapToAlignment={"start"}
                decelerationRate="fast"
                data={this.props.cars}
                renderItem={({ item }) => (
                  <View
                    colors={["transparent", "rgba(0,0,0,0.2)"]}
                    style={{
                      ...styles.carCard
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        zIndex: 9090909090,
                        width: 70,
                        height: 50,
                        position: "absolute",
                        top: 150,
                        right: 20,
                        borderBottomLeftRadius: 50,
                        borderTopLeftRadius: 50,
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: "AvenirNext-Bold"
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: "Avenir-Light"
                        }}
                      >
                        Per day
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: "#3c3537",
                        width: "100%",
                        height: 150
                      }}
                    >
                      <Text>images appear here</Text>
                    </View>
                    <View
                      style={{
                        height: 60,
                        width: "100%",
                        paddingLeft: 5,
                        alignItems: "flex-start"
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 23,
                          fontFamily: "AvenirNext-Bold"
                        }}
                      >
                        {item.make} {item.model}
                        <Text
                          style={{
                            color: colors.primary,
                            fontFamily: "AvenirNext-DemiBold",
                            opacity: 0.5,
                            fontSize: 12
                          }}
                        >
                          {" " + item.year}
                        </Text>
                      </Text>
                      <Rating rating={item.rating} />
                    </View>
                  </View>
                )}
                keyExtractor={item => {
                  return item._id;
                }}
              />
            </View>
          </>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    cars: state.companyReducer.cars,
    loading: state.loginReducer.loading,
    companyModalVisible: state.companyReducer.companyModalVisible,
    searchModalVisible: state.companyReducer.searchModalVisible,
    source: state.companyReducer.source,
    filterModalVisible: state.companyReducer.filterModalVisible
  };
};

const mapDispatchToProps = dispatch => ({
  doFetchCars: () => {
    dispatch(actions.fetchCars());
  },
  doOpenFilterModal: () => {
    dispatch(actions.openFilterModal());
  },
  doSetCompany: company => {
    dispatch(actions.selectCar(company));
  },
  doOpenCompanyModal: () => {
    dispatch(actions.openCarModal());
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
)(CarsScreen);

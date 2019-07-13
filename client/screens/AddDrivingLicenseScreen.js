import React, { Component } from "react";
import {
  Button,
  Text,
  TouchableOpacity,
  View,
  Vibration,
  StatusBar,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Keyboard,
  Image,
  Alert
} from "react-native";
import { LinearGradient, ImagePicker, Permissions, Constants } from "expo";
import { ScrollView } from "react-native-gesture-handler";
import {styles, colors } from "../styles";
import { Header } from "react-native-elements";
import AppText from "../components/AppText";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "../store/firebase";
import DatePicker from "react-native-datepicker";

const storage = firebase.storage();
class AddDrivingLicenseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingLicense:false,
      drivingLicenseLink:null,
      licenseImage:null,
      expiryDate:null
    };
    this.RotateValueHolder = new Animated.Value(0);
  }
  _pickImageLicense = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    this.setState({ uploading: true, loadingLicense: true });
    try {
      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
        this.setState({
          licenseImage: result.uri,
          drivingLicenseLink: uploadUrl 
        });
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      this.setState({ uploading: false, loadingLicense: false });
    }
  };
  uploadImageAsync = async uri => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(Math.random() * 1000000000 + "");
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  AddLicense = async () => {
    console.log(this.state)
  //   try{
  //   AsyncStorage.getItem("jwt").then(token =>
  //     fetch(
  //       `https://carrentalserver.herokuapp.com/car`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-access-token": token
  //         },
  //         body: JSON.stringify(this.state.user)

  //       }
  //     )
  //       .then(res => res.json())
  //       .then(res => {
  //         console.log(res)
  //         if(res.data){
  //           Alert.alert(
  //             'Car Added',
  //             'Your Car has been addded successfully, you will recieve a response within 48 hours.',
  //             [
  //               {text: 'OK', onPress: () => this.props.navigation.navigate("Main")},
  //             ],
  //             {cancelable: false},
              
  //           );
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       })
  //     );
  // }catch(error){
  //   console.log(error)
  // }
  };


  handleLoading = () => {
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2],
      outputRange: [0, -20, 0, 20, 0, -15, 0, 10, 0, -15, 0]
    });

    const labelStyle = {
      transform: [{ translateX: RotateData }]
    };
    return (
      <View style={{ width: "70%" }}>
        <Animated.View style={labelStyle}>
          <TouchableOpacity
            onPress={() => {
              this.AddLicense();
            }}
          >
            <View
              style={styles.button}
              colors={["transparent", "rgba(0,0,0,0.3)"]}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: Platform.OS === "ios" ? "flex-start " : null,
                  alignItems: "center"
                }}
              >
                {!this.props.loading ? (
                  <>
                    <Text  style={{ color: "#FFF" }}>
                      Add Driver's License
                    </Text>
                  </>
                ) : (
                  <ActivityIndicator
                    animating={this.props.loading}
                    size="large"
                    color={"#FFF"}
                    style={{ paddingTop: 7 }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  render() {
    return (
      <>
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
              <AppText style={{ color: "white" }} text={"Add License"} />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Main")}
            >
              <Ionicons
                name={Platform.OS + "-arrow-back"}
                size={30}
                color={"#74808E"}
              />
            </TouchableOpacity>
          }
        />

        
                   <KeyboardAvoidingView
                  style={{
                    backgroundColor: colors.backgroundMain,
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignItems: "stretch",
                    
        
                  }}
                  behavior="padding"
                  enabled
                >
                  <ScrollView
                    style={{
                      backgroundColor: colors.backgroundMain,
                      paddingBottom: 300,
                      padding:20
                    }}
                  >

<DatePicker
              placeholder="License Expiry Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              mode="date"
              style={{
                width: "100%",
                alignItems: "baseline"
              }}
              date={this.state.expiryDate}
              mode="date"
              format="YYYY-MM-DD"
              minDate="2016-05-01"
              showIcon={false}
              customStyles={{
                dateInput: {
                  height: 50,
                  borderStyle: "solid",
                  borderColor: "#0000",

                  borderBottomColor: "#74808E",
                  borderBottomWidth: 1,
                  // borderRadius: 10,
                  marginBottom: 20,
                  fontSize: 18,
                  color: "#000",
                  fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto"
                }
              }}
              onDateChange={date_in => {
                this.setState({expiryDate: date_in}
                 
                )}}
            />

<View alignItems="center">
            {this.state.loadingLicense?<ActivityIndicator
                    animating={true}
                    size="large"
                    color={"#000"}
                    style={{ paddingTop: 7 }}
                  />:<Image
                  source={{ uri: this.state.licenseImage }}
                  style={{ width: 200, height: 150 }}
                  
                />}  

            
              <Button
                title="Add License Image"
                onPress={this._pickImageLicense}
                styles={{paddingTop:10}}
              />
       </View>
       
       <View
            style={{
              padding: 30,
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {this.handleLoading()}
          </View>
    
      </ScrollView>
      </KeyboardAvoidingView>
      </>
    );
  }
}

export default AddDrivingLicenseScreen;

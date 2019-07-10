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
  Image
} from "react-native";
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
import { Base64 } from 'js-base64';
import firebase from "../store/firebase";


const storage = firebase.storage();

class AddCarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        make: null,
        model: null,
        year: null,
        licenseLink: null,
        plateNumber: null,
        licenseExpiryDate: null,
        location: null,
        photosLink: null
      },
      errorMessage1: null,
      image: null,
      licenseImage:null
    };
    this.RotateValueHolder = new Animated.Value(0);
  }

  componentDidMount() {
    this.getPermissionAsync();
  }


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }


    uploadImageAsync= async (uri)=> {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = storage
      .ref()
      .child(Math.random()*1000000000+"");
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
  }



  _pickImage2=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({base64:true});
    try {
      this.setState({ uploading: true });

      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
        // prevState => ({
        //   ...prevState,
        //   user: { ...prevState.user, plateNumber: text }
        // })
        this.setState(prevState => ({  ...prevState,image:result.uri,
          user: { ...prevState.user, photosLink: uploadUrl }}));
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  }
  _pickImageLicense2=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({base64:true});
    try {
      this.setState({ uploading: true });

      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
        this.setState(prevState => ({  ...prevState,licenseImage:result.uri,
          user: { ...prevState.user, licenseLink: uploadUrl }}));
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({base64:true});
    var blob=null;
    try{
    const response = await fetch(result.uri);
     blob = await response.blob();
     console.log(blob)
  }catch(error){
      console.log(error)
    }
    console.log("in")
console.log(result.base64.substring(0,20))
    if (!result.cancelled) {
      var k=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k2=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k3=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k4=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k5=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k6=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k7=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var id=k+k2+k3+k4+k5+k6+k7;
      console.log("in")
      try{
        var inputImage=Base64.encode(result.base64)
      storage.ref('/images/').child(id)
.put(blob, {contentType:"image/jpg"});
} catch(error){
  console.log(error)
}
console.log("in")
      this.setState({ image: result.uri });
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progrss function ....
        },
        error => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          console.log("in")
          storage
            .ref(id)
            .child("pdf")
            .getDownloadURL()
            .then(url => {
              
    console.log(url);
              this.setState({ photosLink:[url] });
            });
          }
        );
      }
    };

  _pickImageLicense = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({base64:true});

    if (!result.cancelled) {
      var k=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k2=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k3=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k4=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k5=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k6=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var k7=(((1+Math.random())*0x10000)|0).toString(16).substring(1)
      var id=k+k2+k3+k4+k5+k6+k7;
      storage.ref('/images/').child(id)
.putString(result.base64.substring(23), "base64", {contentType:"image/jpg"});
      this.setState({ licenseImage: result.uri });
      uploadTask.on(
        "state_changed",
        snapshot => {
          // progrss function ....
        },
        error => {
          // error function ....
          console.log(error);
        },
        () => {
          // complete function ....
          storage
            .ref(id)
            .child("pdf")
            .getDownloadURL()
            .then(url => {
              console.log(url)
              this.setState({ licenseLink:url });
            });
          }
        );
      }
    };

  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);

    Animated.timing(this.RotateValueHolder, {
      toValue: 2,
      duration: 500,
      easing: Easing.quad
    }).start();
  }
  //   handleVerification =async () => {
  //     Keyboard.dismiss()
  //     const { password } = this.state.user;
  //     const { RepeatPassword } = this.state;
  //     if (password.length < 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage1: "*password must be 8 characters or more"
  //       }));
  //       this.props.doError(true);
  //     } else {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage1: ""
  //       }));
  //     }
  //     if (password !== RepeatPassword&&password.length > 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage2: "*passwords do not match"
  //       }));
  //       this.props.doError(true);
  //     } else {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         errorMessage2: ""
  //       }));
  //     }
  //     if (password === RepeatPassword && password.length >= 8) {
  //       this.setState(prevState => ({
  //         ...prevState,
  //         error: false,
  //         errorMessage1: "",
  //         errorMessage2: ""
  //       }));
  //       await this.props.doLogin(this.state.user)
  //       this.props.navigation.navigate("Home")
  //     }

  //   };

  componentDidUpdate = () => {
    if (this.props.error) {
      Vibration.vibrate([100]);
      this.StartImageRotateFunction();
      this.props.doError(false);
    }
  };

  AddCar = async () => {
    console.log(this.state.user)
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
              this.AddCar();
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
                      Add Car
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
              <AppText style={{ color: "white" }} text={"Add Car"} />
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
            <FloatingLabelInput
              style={styles.text}
              label={"Car Make"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, make: text }
                }));
              }}
              value={this.state.user.make}
            />
            <FloatingLabelInput
              style={styles.text}
              label={"Car Model"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, model: text }
                }));
              }}
              value={this.state.user.model}
            />
            <FloatingLabelInput
              style={styles.text}
              label={"Year of Production"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, year: text }
                }));
              }}
              value={this.state.user.year}
              keyboardType="numeric"
            />
            <FloatingLabelInput
              style={styles.text}
              label="License Plate Number"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, plateNumber: text }
                }));
              }}
              value={this.state.user.plateNumber}
            />
            <FloatingLabelInput
              style={styles.text}
              label="Location"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, plateNumber: text }
                }));
              }}
              value={this.state.user.plateNumber}
            />


            <DatePicker
              placeholder="License Expiry Date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              mode="date"
              style={{
                width: "100%",
                alignItems: "baseline"
              }}
              date={this.state.licenseExpiryDate}
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
                this.setState({ licenseExpiryDate: date_in });
              }}
            />

            <View alignItems="center">
                <Image
                  source={{ uri: this.state.licenseImage }}
                  style={{ width: 100, height: 60 }}
                  
                />
            
              <Button
                title="Upload License Image"
                onPress={this._pickImageLicense2}
                styles={{paddingTop:10}}
              />
       </View>
       
       <View alignItems="center">
                <Image
                  source={{ uri: this.state.image }}
                  style={{ width: 100, height: 60 }}
                  
                />
            
              <Button
                title="Upload Car Image"
                onPress={this._pickImage2}
                styles={{paddingTop:10}}
              />
       </View>

          <StatusBar barStyle={"light-content"} />

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

export default AddCarScreen;

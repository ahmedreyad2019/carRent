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
        photosLink: []
      },
      errorMessage1: null,
      image: [],
      licenseImage:null,
      loadingCar:false,
      loadingLicense:false
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



  _pickImage=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync();
    this.setState({ uploading: true ,loadingCar:true});
    try {
      

      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
  
        this.state.user.photosLink.push(uploadUrl)
        this.state.image.push(result.uri)
        var newUris=this.state.image.slice();
        var newPhotos=this.state.user.photosLink.slice();
        this.setState(prevState => ({  ...prevState,image:newUris,
          user: { ...prevState.user, photosLink: newPhotos }}));
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false ,loadingCar:false});
    }
  }
  _pickImageLicense=async()=>{
    let result = await ImagePicker.launchImageLibraryAsync();
    this.setState({ uploading: true ,loadingLicense:true});
    try {
      

      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
        this.setState(prevState => ({  ...prevState,licenseImage:result.uri,
          user: { ...prevState.user, licenseLink: uploadUrl }}));
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false,loadingLicense:false });
    }
  }

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
    try{
    AsyncStorage.getItem("jwt").then(token =>
      fetch(
        `https://carrentalserver.herokuapp.com/car`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          },
          body: JSON.stringify(this.state.user)

        }
      )
        .then(res => res.json())
        .then(res => {
          console.log(res)
          if(res.data){
            Alert.alert(
              'Car Added',
              'Your Car has been addded successfully, you will recieve a response within 48 hours.',
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate("Main")},
              ],
              {cancelable: false},
              
            );
          }
        })
        .catch(error => {
          console.log(error);
        })
      );
  }catch(error){
    console.log(error)
  }
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
                  user: { ...prevState.user, location: text }
                }));
              }}
              value={this.state.user.location}
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
              date={this.state.user.licenseExpiryDate}
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
                this.setState(prevState => ({  ...prevState,
                  user: { ...prevState.user, licenseExpiryDate: date_in }}));
              }}
            />

            <View alignItems="center">
            {this.state.loadingLicense?<ActivityIndicator
                    animating={true}
                    size="large"
                    color={"#000"}
                    style={{ paddingTop: 7 }}
                  />:<Image
                  source={{ uri: this.state.licenseImage }}
                  style={{ width: 100, height: 60 }}
                  
                />}  

            
              <Button
                title="Add License Image"
                onPress={this._pickImageLicense}
                styles={{paddingTop:10}}
              />
       </View>
       
       <View alignItems="center">
              {this.state.loadingCar?<ActivityIndicator
                    animating={true}
                    size="large"
                    color={"#000"}
                    style={{ paddingTop: 7 }}
                  />:<Image
                  source={{ uri: this.state.image[this.state.image.length-1] }}
                  style={{ width: 100, height: 60 }}
                  
                />}  
                 
            
              <Button
                title={this.state.image.length==0?"Add Car Image":"Add Another Car Image"}
                onPress={this._pickImage}
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

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

class AddCarScreen2 extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      user: {
        make: navigation.getParam('car').make,
        model: navigation.getParam('car').model,
        year: navigation.getParam('car').year,
        licenseLink: null,
        plateNumber: null,
        licenseExpiryDate: null,
        location: navigation.getParam('car').location,
        photosLink: [],
        transmission: navigation.getParam('car').transmission,
        kilometers:navigation.getParam('car').kilometers
      },
      errorMessageLink:null,
      errorMessagePlate:null,
      errorMessageExpiry:null,
      errorMessagePhotos:null,
      image: [],
      licenseImage:null,
      loadingCar:false,
      loadingLicense:false,
      
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
  

  componentDidUpdate = () => {
    if (this.props.error) {
      Vibration.vibrate([100]);
      this.StartImageRotateFunction();
    }
  };

  AddCar = async () => {

    Keyboard.dismiss()
        const { make,model,year,licenseLink,licenseExpiryDate,plateNumber,location,photosLink } = this.state.user;
        const { RepeatPassword } = this.state;
        var error=false
      
        if (!licenseLink) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageLink: "*Please specify License"
          }));
          error=true;
          
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageLink: null
          }));
        }

        if (!licenseExpiryDate) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageExpiry: "*Please Specify License expiry date"
          }));
          error=true;
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageExpiry: null
          }));
        }
        if (!plateNumber) {
          this.setState(prevState => ({
            ...prevState,
            errorMessagePlate: "*Please specify Plate Number"
          }));
          error=true;
          
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessagePlate: null
          }));
        }
        if (!error) {
          this.setState(prevState => ({
            ...prevState,
            error: false
          }));

          this.props.navigation.navigate("AddCar3",{car:this.state.user})
  };}
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
                      Next
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
              <AppText style={{ color: "white" }} text={"Add License "} />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("AddCar")}
            >
              <Ionicons
                name={"ios-arrow-back"}
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
              label="License Plate Number"
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, plateNumber: text }
                }));
              }}
              value={this.state.user.plateNumber}
            />
               <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessagePlate}
              </Text>
            </>

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
   <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageExpiry}
              </Text>
            </>
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
       <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageLink}
              </Text>
            </>
  
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

export default AddCarScreen2;

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
  AsyncStorage,
  Picker
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
        location: null,
        transmission:"Automatic",
        kilometers:"",
      },
      errorMessageMake: null,
      errorMessageModel:null,
      errorMessageYear:null,
      errorMessageLink:null,
      errorMessagePlate:null,
      errorMessageExpiry:null,
      errorMessageLocation:null,
      errorMessagePhotos:null,
      errorMessageKilo:"",
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
        const { make,model,year,licenseLink,licenseExpiryDate,plateNumber,location,kilometers } = this.state.user;
        const { RepeatPassword } = this.state;
        var error=false
        if (!make) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageMake: "*Please Specify a Make"
          }));
          error=true;
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageMake: null
          }));
        }
        if (!model) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageModel: "*Please specify a Model"
          }));
          error=true;
          
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageModel: null
          }));
        }
        if (!year) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageYear: "*Please Specify a Year"
          }));
          error=true;
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageYear: null
          }));
        }
      
        if (!location) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageLocation: "*Please Specify pick up location"
          }));
          error=true;
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageLocation: null
          }));
        }
        if (kilometers.length==0) {
          this.setState(prevState => ({
            ...prevState,
            errorMessageKilo: "*Please Specify Kilometers Range"
          }));
          error=true;
        } else {
          this.setState(prevState => ({
            ...prevState,
            errorMessageKilo: null
          }));
        }
        if (!error) {
          this.setState(prevState => ({
            ...prevState,
            error: false
          }));
          this.props.navigation.navigate("AddCar2",{car:this.state.user})
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
              <AppText style={{ color: "white" }} text={"Add Car"} />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Main")}
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
              label={"Car Make"}
              onChangeText={text => {
                this.setState(prevState => ({
                  ...prevState,
                  user: { ...prevState.user, make: text }
                }));
              }}
              value={this.state.user.make}
            />
               <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageMake}
              </Text>
            </>
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
               <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageModel}
              </Text>
            </>
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
               <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageYear}
              </Text>
            </>

            <Picker
  selectedValue={this.state.user.transmission}
  style={{height: 50, width: "100%"}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, transmission: itemValue }
    }))
  }>
  <Picker.Item label="Automatic" value="Automatic" />
  <Picker.Item label="Manual" value="Manual" />
</Picker>


<Picker
  selectedValue={this.state.user.kilometers}
  style={{height: 50, width: "100%"}}
  onValueChange={(itemValue, itemIndex) =>
    this.setState(prevState => ({
      ...prevState,
      user: { ...prevState.user, kilometers: itemValue }
    }))
  }>
  <Picker.Item label="Kilometers" value="" />
  <Picker.Item label="0 to 50K" value="0-50" />
  <Picker.Item label="50k to 100K" value="50-100" />
  <Picker.Item label="100k to 150K" value="100-150" />
  <Picker.Item label="150k to 200K" value="150-200" />
  <Picker.Item label="More Than 200K" value="200+" />
</Picker>
            <>
                <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
               >
                {this.state.errorMessageKilo}
              </Text>
            </>
           
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
   <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessageLocation}
              </Text>
            </>
       
      
       <>
              
              <Text
                style={{
                  color: "#FF8080",
                  fontSize:12
                }}
              >
                {this.state.errorMessagePhotos}
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

export default AddCarScreen;

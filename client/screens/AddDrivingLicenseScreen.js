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
  Animated,
  Easing,
  Keyboard,
  Image,
  Alert
} from "react-native";
import { LinearGradient, ImagePicker, Permissions, Constants } from "expo";
import { colors } from "../styles";
import { Header } from "react-native-elements";
import AppText from "../components/AppText";
import Ionicons from "react-native-vector-icons/Ionicons";
import firebase from "../store/firebase";

class AddDrivingLicenseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingLicense:false,
      licenseLink:null,
      licenseImage:null
    };
  }
  _pickImageLicense = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    this.setState({ uploading: true, loadingLicense: true });
    try {
      if (!result.cancelled) {
        uploadUrl = await this.uploadImageAsync(result.uri);
        this.setState({
          licenseImage: result.uri,
          licenseLink: uploadUrl 
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

  render() {
    return (
        <View>
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
      <Button
        title="Add License Image"
        onPress={this._pickImageLicense}
        styles={{ paddingTop: 10 }}
      />
      </View>
    );
  }
}

export default AddDrivingLicenseScreen;

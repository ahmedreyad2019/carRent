import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import MainTabNavigator from "./navigation/MainTabNavigator";
import { Provider } from "react-redux";
import { store } from "./store/index";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainTabNavigator  />
      </Provider>
    );
  }
}

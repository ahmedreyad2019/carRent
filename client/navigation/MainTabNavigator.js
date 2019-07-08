import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
  DrawerItems,
  SafeAreaView
} from "react-navigation";
import { styles, colors } from "../styles";
import { Easing, Animated, ScrollView, View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import React from "react";
import ProfileScreen from "../screens/ProfileScreen";
import CarsScreen from "../screens/CarsScreen";
import FilterScreen from "../screens/FilterScreen";
import MainScreen from "../screens/MainScreen";
import RentModal from "../components/RentModal";
import TransactionsScreen from "../screens/TransactionsScreen";

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === "Feed") {
    iconName = `home`;
  } else if (routeName === "Profile") {
    iconName = `person`;
  } else if (routeName === "Companies") {
    iconName = `paper`;
  }

  return <IconComponent name={`ios-` + iconName} size={25} color={tintColor} />;
};

const filterNav = createStackNavigator(
  {
    content: { screen: CarsScreen },
    modal: { screen: FilterScreen }
  },
  {
    headerMode: "none",
    mode: "modal",
    initialRouteName: "content",
    transparentCard: true,
    transitionConfig: () => ({
      transitionSpec: {
        duration: 550,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
        useNativeDriver: true
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const thisSceneIndex = scene.index;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [height, 0, 0]
        });

        const opacity = position.interpolate({
          inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
          outputRange: [1, 1, 0.5]
        });

        return { opacity, transform: [{ translateY }] };
      }
    })
  }
);
const user = { name: "ahmed reyad" };
const Profile = () => (
  <View
    style={{
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderBottomColor: "black",
      borderBottomWidth: 1
    }}
  >
    <View>
      <View style={styles.avatar}>
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            color: "#90F6DE"
          }}
        >
          {user.name.split(" ")[0].substring(0, 1) +
            user.name
              .split(" ")
              [user.name.split(" ").length - 1].substring(0, 1)}
        </Text>
      </View>
    </View>
    {user ? (
      <View style={{ flex: 0.75 }}>
        <Text
          style={{
            fontSize: 16,
            color: "#bbbbbb",
            fontWeight: "bold",
            borderBottomColor: "#293749"
          }}
        >
          {user.name}
        </Text>
      </View>
    ) : (
      <></>
    )}
  </View>
);
const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
      <View>
        <Profile />
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const RentScreen = createAppContainer(
  createStackNavigator(
    {
      Main: { screen: MainScreen },
      Cars: { screen: CarsScreen },
      Rent: { screen: RentModal }
    },
    {
      headerMode: "none"
    }
  )
);
const tabNav = createAppContainer(
  createDrawerNavigator(
    {
      Home: { screen: RentScreen },
      Companies: { screen: filterNav },
      Profile: { screen: ProfileScreen },
      Transaction:{screen:TransactionsScreen}
    },
    {
      contentComponent: CustomDrawerContentComponent,

      drawerWidth: 300
    }
  )
);

const MainNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Home: { screen: HomeScreen },
      Register: { screen: RegisterScreen },
      Dashboard: { screen: tabNav }
    },
    {
      mode: "card",
      headerMode: "none",

      navigationOptions: {
        headerVisible: true
      },

      transitionConfig: () => ({
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.poly(4)),
          timing: Animated.timing
        }
      })
    }
  )
);

const App = createAppContainer(MainNavigator);

export default App;

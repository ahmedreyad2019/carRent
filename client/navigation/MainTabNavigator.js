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
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import OwnedCarsScreen from "../screens/OwnedCarsScreen";
import AddCarScreen from "../screens/AddCarScreen";

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === "Home") {
    iconName = `home`;
  } else if (routeName === "Profile") {
    iconName = `person`;
  } else if (routeName === "MyCars") {
    iconName = `car`;
  }

  return <IconComponent name={`ios-` + iconName} size={25} color={tintColor} />;
};

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

const CarOwnerScreen = createAppContainer(
  createStackNavigator(
    {
      Main: { screen: AddCarScreen },
      AddCar: { screen: OwnedCarsScreen }
    },
    {
      headerMode: "none"
    }
  )
);

const TransactionsScreens = createAppContainer(
  createStackNavigator(
    {
      Transaction: { screen: TransactionsScreen },
      TransactionDetails: { screen: TransactionDetailsScreen }
    },
    {
      headerMode: "none"
    }
  )
);

const LoginScreen = createAppContainer(
  createStackNavigator(
    {
      Home: { screen: HomeScreen },
      Register: { screen: RegisterScreen }
    },
    {
      headerMode: "none"
    }
  )
);
const ProfileStack = createAppContainer(
  createStackNavigator(
    {
      Profile: { screen: ProfileScreen },
      Transaction: { screen: TransactionsScreens }
    },
    {
      headerMode: "none"
    }
  )
);
const tabNav = createAppContainer(
  createBottomTabNavigator(
    {
      Home: { screen: RentScreen },
      Profile: { screen: ProfileScreen },
      MyCars:{screen:CarOwnerScreen}
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) =>
          getTabBarIcon(navigation, focused, tintColor)
      }),
      tabBarOptions: {
        activeTintColor: "white",
        inactiveTintColor: "#999999",
        style: {
          backgroundColor: colors.primary
        }
      }
    }
  )
);

const MainNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Home: { screen: LoginScreen },
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

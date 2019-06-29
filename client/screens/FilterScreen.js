import React from "react";
import {
  SegmentedControlIOS,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Button
} from "react-native";

const styles = {
  profile: {
    padding: 20,
    backgroundColor: "#303655",
    borderColor: "#DBA73F",
    borderRadius: "33px",
    borderWidth: "3",
    shadowColor: "#000",
    width: 245,
    height: 267,
    shadowOpacity: 0.4,
    shadowRadius: 3,
    shadoOffset: {
      height: 3
    },
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1
  }
};
class FilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      data: [],
      data2: [],
      results: [],
      results2: [],
      loading: false,
      order: "asc",
      selectedKey: "nameInEnglish",
      search: ""
    };
  }
 
  render() {
    return (
      <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end'}}>
          <View style={{ height: "50%" ,width: '100%', backgroundColor:"#fff", justifyContent:"center"}}>
            <Text>Testing a modal with transparent background</Text>
          </View>
      </View>
    );
  }
}

export default FilterScreen;

import React from "react";
import { View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    var rating = this.props.rating;
    var rat = [0, 0, 0, 0, 0];
    var i = 0;
    while (rating > 1) {
      rat[i] = 1;
      rating -= 1;
      i += 1;
    }
    rat[i] = rating;
    return (
      <View style={{ flexDirection: "row" }}>
        {rat.map((item, i) => (
          <Ionicons
            key={i}
            name={
              rat[i] === 1
                ? "ios-star"
                : rat[i] === 0
                ? "ios-star-outline"
                : "ios-star-half"
            }
            size={15}
            color={"black"}
          />
        ))}
      </View>
    );
  }
}

export default Rating;

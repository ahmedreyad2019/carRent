import React from "react";
import { View } from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../styles";
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
            style={{
              marginHorizontal: this.props.size ? this.props.size / 8 : 1
            }}
            key={i}
            name={
              rat[i] === 1
                ? "md-star"
                : rat[i] === 0
                ? "md-star-outline"
                : "md-star-half"
            }
            size={this.props.size ? this.props.size : 15}
            color={colors.primary}
          />
        ))}
      </View>
    );
  }
}

export default Rating;

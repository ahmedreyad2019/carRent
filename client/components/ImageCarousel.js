import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { colors } from "../styles";
class ImageCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }
  scrollToIndex = i => {
    this.flatListRef.scrollToIndex({ animated: true, index: i });
  };
  onViewableItemsChanged = ({ viewableItems, changed }) => {
    this.setState({ index: viewableItems[0].index });
  };

  render() {
    return (
      <View style={{ height: 140 }}>
        <FlatList
          onViewableItemsChanged={this.onViewableItemsChanged}
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={this.props.images}
          horizontal
          snapToAlignment={'center'}
          decelerationRate={"fast"}
          snapToInterval={!this.props.full ? 350 : this.props.full}
          renderItem={({ item, index }) => (
            <Image
              style={{ height: 140, width: this.props.full ? 400 : 350 }}
              source={item}
              loadingIndicatorSource={require("../images/transparent-background-loading.gif")}
            />
          )}
          keyExtractor={index => {
            return index.toString();
          }}
          ListEmptyComponent={
            <View>
              <Text>no images</Text>
            </View>
          }
        />
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            bottom: 10,
            alignSelf: "center"
          }}
        >
          {this.props.images.map((item, i) => (
            <TouchableOpacity
              onPress={() => {
                this.scrollToIndex(i), console.log(i + "  " + this.state.index);
              }}
              key={i}
              style={{
                marginHorizontal: 5,
                width: 12,
                height: 12,

                backgroundColor:
                  this.state.index === i ? "white" : "rgba(255,255,255,0.5)",
                borderRadius: 12
              }}
            />
          ))}
        </View>
      </View>
    );
  }
}

export default ImageCarousel;
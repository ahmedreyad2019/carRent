import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import React, { Component } from "react";
import { colors } from "../styles";
import AppText from "./AppText";
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
    const screenWidth = Math.round(Dimensions.get("window").width);
    return (
      <View
        style={{
          height: this.props.full ? 200 : 160,
          backgroundColor: "black"
        }}
      >
        <FlatList
          onViewableItemsChanged={this.onViewableItemsChanged}
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={this.props.images}
          horizontal
          snapToAlignment={"center"}
          decelerationRate={"fast"}
          bouncesZoom={true}
          snapToInterval={this.props.full ? screenWidth : screenWidth - 40}
          renderItem={({ item }) => (
            <Image
              resizeMode={this.props.full ? "contain" : "cover"}
              style={{
                height: this.props.full ? 200 : 160,
                width: this.props.full ? screenWidth : screenWidth - 40
              }}
              loadingIndicatorSource={
                <AppText style={{ color: "white" }} text={"loading..."} />
              }
              source={{ uri: item }}
              onLoadStart={e => this.setState({ loading: true })}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={{
                width: this.props.full ? screenWidth : screenWidth - 40,
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <AppText text={"no images"} style={{ color: "white" }} />
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
          {this.props.images
            ? this.props.images.map((item, i) => (
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                  onPress={() => {
                    this.scrollToIndex(i),
                      console.log(i + "  " + this.state.index);
                  }}
                  key={i}
                  style={{
                    marginHorizontal: 5,
                    width: 12,
                    height: 12,

                    backgroundColor:
                      this.state.index === i
                        ? "white"
                        : "rgba(255,255,255,0.5)",
                    borderRadius: 12
                  }}
                />
              ))
            : console.log()}
        </View>
      </View>
    );
  }
}

export default ImageCarousel;

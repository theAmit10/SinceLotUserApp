import React from "react";
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import { COLORS } from "../../../assets/constants";
    
const SplashScreenGradientText = (props) => {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={[COLORS.golden, COLORS.goldenLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]}  numberOfLines={1}/>
      </LinearGradient>
    </MaskedView>
  );
};

export default SplashScreenGradientText;
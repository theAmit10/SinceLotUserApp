import React from 'react';
import { View } from 'react-native';
import GradientCircle from './GradientCircle'; // Import the component
import { heightPercentageToDP } from 'react-native-responsive-screen';

const CircleContainer = ({jackpotnumber}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: heightPercentageToDP(1),
      }}>
      <GradientCircle value={jackpotnumber[0]} />
      <GradientCircle value={jackpotnumber[1]} />
      <GradientCircle value={jackpotnumber[2]} />
      <GradientCircle value={jackpotnumber[3]} />
      <GradientCircle value={jackpotnumber[4]} />   
      <GradientCircle value={jackpotnumber[5]} />       
    </View>
  );
};

export default CircleContainer;

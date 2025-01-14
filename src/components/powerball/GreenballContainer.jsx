
import React from 'react';
import { View } from 'react-native';
import GradientCircle from './GradientCircle'; // Import the component
import { heightPercentageToDP } from 'react-native-responsive-screen';
import GreenBall from './GreenBall';

const GreenballContainer = ({jackpotnumber}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: heightPercentageToDP(1),
      }}>
      <GreenBall value={jackpotnumber[0]} />
      <GreenBall value={jackpotnumber[0]} />
      <GreenBall value={jackpotnumber[0]} />
      <GreenBall value={jackpotnumber[0]} />
      <GreenBall value={jackpotnumber[0]} />
      <GreenBall value={jackpotnumber[0]} />
            
    </View>
  );
};

export default GreenballContainer;

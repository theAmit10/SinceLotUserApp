import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../../../assets/constants';

const Loading = ({props}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator {...props} color={COLORS.white_s} size={'large'} />
    </View>
  );
};

export default Loading;

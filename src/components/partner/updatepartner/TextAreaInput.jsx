import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';

const TextAreaInput = ({title, value, onChangeText, placeholder}) => {
  return (
    <LinearGradient
      colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
      start={{x: 0, y: 0}} // start from left
      end={{x: 1, y: 0}} // end at right
      style={styles.container}>
      <View style={{paddingStart: heightPercentageToDP(1)}}>
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(1.8),
          }}>
          {title}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: COLORS.white_s,
          padding: heightPercentageToDP(1),
          borderBottomLeftRadius: heightPercentageToDP(1),
          borderBottomRightRadius: heightPercentageToDP(1),
        }}>
        <TextInput
          style={styles.valueInput}
          value={value}
          onChangeText={onChangeText} // Updates state in parent
          multiline={true} // Enables multiline input
          textAlignVertical="top" // Aligns text to the top
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
        />
      </View>
    </LinearGradient>
  );
};

export default TextAreaInput;

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(15), // Increase height to accommodate multiline input
    borderRadius: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(2),
  },
  valueInput: {
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    height: '100%', // Ensure the input expands to fill the parent view
    textAlignVertical: 'top', // Align text to the top for multiline
  },
});

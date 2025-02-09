import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';
import {COLORS, FONT} from '../../../../assets/constants';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';

const UpdatePartnerInput = ({
  title,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => {
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
          paddingStart: heightPercentageToDP(1),
          borderBottomLeftRadius: heightPercentageToDP(1),
          borderBottomRightRadius: heightPercentageToDP(1),
        }}>
        <TextInput
          style={styles.valueInput}
          value={value}
          onChangeText={onChangeText} // Updates state in parent
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          keyboardType={keyboardType}
        />
      </View>
    </LinearGradient>
  );
};

export default UpdatePartnerInput;

const styles = StyleSheet.create({
  container: {
    height: heightPercentageToDP(9),
    borderRadius: heightPercentageToDP(1),
    marginTop: heightPercentageToDP(2),
  },
  titleInput: {
    fontFamily: FONT.Montserrat_Regular,
    fontSize: heightPercentageToDP(1.8),
    color: COLORS.black,
  },
  valueInput: {
    fontFamily: FONT.Montserrat_Bold,
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
  },
});

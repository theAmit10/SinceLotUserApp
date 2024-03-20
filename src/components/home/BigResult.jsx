import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useState } from 'react';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BigResult = ({data}) => {
  return (
    <View
      style={{
        height: heightPercentageToDP(35),
        backgroundColor: COLORS.grayHalfBg,
        marginTop: heightPercentageToDP(2),
        borderRadius: heightPercentageToDP(2),
        elevation: heightPercentageToDP(1),
      }}>
      <View
        style={{
          height: heightPercentageToDP(25),
          borderRadius: heightPercentageToDP(1),
          flexDirection: 'row',
        }}>
        {/** Top view left container */}
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: FONT.Montserrat_Regular,
              fontSize: heightPercentageToDP(3),
              marginTop: heightPercentageToDP(2),
            }}
            numberOfLines={1}>
            {data.lotlocation.lotlocation}
          </Text>
          <Text
            style={{
              fontFamily: FONT.SF_PRO_REGULAR,
              fontSize: heightPercentageToDP(13),
              color: COLORS.black,
              marginTop: heightPercentageToDP(-2),
            }}
            numberOfLines={1}>
            {data.resultNumber}
          </Text>
        </View>

        {/** Top view right container */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.grayHalfBg,
            justifyContent: 'center',
          }}>
          <View style={{position: 'absolute', top: 2, zIndex: 1}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: FONT.Montserrat_Regular,
                  color: COLORS.black,
                }}>
                Next
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: FONT.Montserrat_Regular,
                  color: COLORS.black,
                }}>
                Result
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: COLORS.black,
                  fontFamily: FONT.HELVETICA_BOLD,
                }}>
                05:00 PM
              </Text>
            </View>
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Text
              style={{
                transform: [{rotate: '90deg'}],
                color: COLORS.black,
                fontFamily: FONT.Montserrat_SemiBold,
                fontSize: heightPercentageToDP(1.5),
                paddingHorizontal: heightPercentageToDP(1),
              }}>
              {data.lottime.lottime}
            </Text>
          </View>
        </View>
      </View>

      {/** Big Result bottom container */}
      

      <TouchableOpacity
      
        style={{
          flex: 1,
          backgroundColor: COLORS.white_s,
          margin: heightPercentageToDP(1),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          gap: heightPercentageToDP(1),
          zIndex: 2
        }}>
        <View
          style={{
            backgroundColor: COLORS.grayHalfBg,
            padding: heightPercentageToDP(1),
            borderRadius: heightPercentageToDP(1),
            marginStart: heightPercentageToDP(-3),
          }}>
          <Ionicons
            name={'calendar'}
            size={heightPercentageToDP(3)}
            color={COLORS.darkGray}
          />
        </View>

        <Text
          style={{
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(2),
          }}>
          {data.lotdate.lotdate}
        </Text>

        <Text
          style={{
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(2),
          }}>
          {data.lottime.lottime}
        </Text>

        <Text
          style={{
            fontFamily: FONT.Montserrat_Regular,
            fontSize: heightPercentageToDP(2),
          }}>
          {data.resultNumber}
        </Text>

        <TouchableOpacity
     
          style={{
            backgroundColor: COLORS.grayHalfBg,
            padding: heightPercentageToDP(0.5),
            borderRadius: heightPercentageToDP(1),
          }}>
          <Ionicons
            name={'caret-down-circle-sharp'}
            size={heightPercentageToDP(3)}
            color={COLORS.darkGray}
          />
        </TouchableOpacity>
      </TouchableOpacity>


    </View>
  );
};

export default BigResult;

const styles = StyleSheet.create({});

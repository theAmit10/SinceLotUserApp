import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../../assets/constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

import GradientText from '../helpercComponent/GradientText';
import { HOVER } from 'nativewind/dist/utils/selector';

const BigResult = ({data}) => {
  const [showDate, setShowDate] = useState(true);
  const toogleView = () => {
    setShowDate(false);
  };

  const dataa = [
    {date: '06-07-2018', time: '08-00 AM', result: '890'},
    {date: '06-07-2018', time: '09-00 PM', result: '899'},
    {date: '06-07-2018', time: '01-00 PM', result: '010'},
    {date: '06-07-2018', time: '03-00 PM', result: '900'},
    {date: '06-07-2018', time: '05-00 PM', result: '690'},
    {date: '06-07-2018', time: '07-00 PM', result: '090'},
  ];

  return (
    <>
      {showDate ? (
        <View
          style={{
            height: heightPercentageToDP(40),
            backgroundColor: COLORS.grayHalfBg,
            marginTop: heightPercentageToDP(2),
            borderRadius: heightPercentageToDP(2),
            elevation: heightPercentageToDP(1),
          }}>
          <View
            style={{
              height: heightPercentageToDP(30),
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
                  fontFamily: FONT.Montserrat_SemiBold,
                  fontSize: heightPercentageToDP(3),
                  marginTop: heightPercentageToDP(2),
                }}
                numberOfLines={1}>
                {data.lotlocation.lotlocation}
              </Text>
              <Text
                style={{
                  fontFamily: FONT.SF_PRO_REGULAR,
                  fontSize: heightPercentageToDP(14),
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
                justifyContent: 'center',
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                  zIndex: 1,
                  borderRadius: heightPercentageToDP(2),
                }}>
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

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  borderRadius: heightPercentageToDP(2),
                }}>
                <Text
                  style={{
                    transform: [{rotate: '90deg'}],
                    color: COLORS.black,
                    fontFamily: FONT.Montserrat_SemiBold,
                    fontSize: heightPercentageToDP(2),
                    paddingHorizontal: heightPercentageToDP(1),
                    marginStart: heightPercentageToDP(-4),
                  }}>
                  03:20
                </Text>
              </View>
            </View>
          </View>

          {/** Big Result bottom container */}

          <TouchableOpacity
            onPress={toogleView}
            style={{
              flex: 1,
              backgroundColor: COLORS.white_s,
              margin: heightPercentageToDP(1),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: heightPercentageToDP(1),
              zIndex: 2,
              borderRadius: heightPercentageToDP(1)
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

            <View
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
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            height: heightPercentageToDP(45),
            backgroundColor: COLORS.grayHalfBg,
            marginTop: heightPercentageToDP(2),
            borderRadius: heightPercentageToDP(2),
            elevation: heightPercentageToDP(1),
          }}>
          <View
            style={{
              height: heightPercentageToDP(35),
              borderRadius: heightPercentageToDP(1),
              flexDirection: 'row',
            }}>
            {/** Top view left container */}
            <View
              style={{
                flex: 5,
                padding: heightPercentageToDP(1),
              }}>
              {/** Top Locaton With Result */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: heightPercentageToDP(1),
                }}>
                <GradientText
                  style={{
                    fontSize: heightPercentageToDP(3),
                    fontFamily: FONT.Montserrat_Bold,
                  }}>
                  {data.lotlocation.lotlocation}
                </GradientText>

                <GradientText
                  style={{
                    fontSize: heightPercentageToDP(3),
                    fontFamily: FONT.Montserrat_Bold,
                   
                    marginEnd: heightPercentageToDP(1),
                  }}>
                  {data.resultNumber}
                </GradientText>

               
              </View>

              {/** List of result in flatlist */}

              <View
                style={{
                  backgroundColor: COLORS.white,
                  flex: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: heightPercentageToDP(1)
                }}>
                {/** All Date for a specific location */}

                {dataa.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignItems: 'stretch',
                      gap: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        textAlign: 'left',
                      }}>
                      {item.date}
                    </Text>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                      }}>
                      {item.time}
                    </Text>

                    <Text
                      style={{
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                        textAlign: 'right',
                      }}>
                      {item.result}
                    </Text>
                  </View>
                ))}
              </View>
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

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    transform: [{rotate: '90deg'}],
                    color: COLORS.black,
                    fontFamily: FONT.Montserrat_SemiBold,
                    fontSize: heightPercentageToDP(2.5),
                    paddingHorizontal: heightPercentageToDP(1),

                    marginStart: heightPercentageToDP(-3),
                  }}>
                  03:20
                </Text>
              </View>
            </View>
          </View>

          {/** Big Result bottom container */}

          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={{
              flex: 1,
              backgroundColor: COLORS.white_s,
              margin: heightPercentageToDP(1),
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: heightPercentageToDP(1),
              zIndex: 2,
              borderRadius: heightPercentageToDP(1)
            }}>
            <Text
              style={{
                fontFamily: FONT.Montserrat_Regular,
                fontSize: heightPercentageToDP(2),
                color: COLORS.black,
              }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default BigResult;

const styles = StyleSheet.create({});

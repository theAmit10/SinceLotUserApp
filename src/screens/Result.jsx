import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LoginBackground from '../components/login/LoginBackground';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {HOVER} from 'nativewind/dist/utils/selector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Background from '../components/background/Background';
import {useDispatch, useSelector} from 'react-redux';
import {getResultAccordingToLocationTimeDate} from '../redux/actions/resultAction';
import Loading from '../components/helpercComponent/Loading';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const Result = ({route}) => {
  const {datedata} = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);
  const {loadingResult, results} = useSelector(state => state.result);
  const [filteredData, setFilteredData] = useState([]);

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(
      getResultAccordingToLocationTimeDate(
        accesstoken,
        datedata._id,
        datedata.lottime._id,
        datedata.lottime.lotlocation,
      ),
    );
  }, [dispatch, focused]);

  useEffect(() => {
    setFilteredData(results); // Update filteredData whenever locations change
  }, [results]);

  const submitHandler = () => {
    console.log('Working on login ');
    Toast.show({
      type: 'success',
      text1: 'Processing',
    });
  };

  return (
    <View style={{flex: 1}}>
      <Background />

      {/** Result Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(75),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(75),
              width: widthPercentageToDP(100),

              borderTopLeftRadius: heightPercentageToDP(5),
              borderTopRightRadius: heightPercentageToDP(5),
            }}>
            {/** Top Style View */}
            <View
              style={{
                height: heightPercentageToDP(5),
                width: widthPercentageToDP(100),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: widthPercentageToDP(20),
                  height: heightPercentageToDP(0.8),
                  backgroundColor: COLORS.grayBg,
                  borderRadius: heightPercentageToDP(2),
                }}></View>
            </View>

            {/** Result Main Container */}

            <View
              style={{
                margin: heightPercentageToDP(2),
                backgroundColor: 'transparent',
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Result
              </GradientTextWhite>
              <GradientTextWhite style={styles.textStyle}>
                Details
              </GradientTextWhite>
            </View>

            {loadingResult ? (
              <Loading />
            ) : filteredData.length == 0 ? (
              <NoDataFound data={'No Result Found'} />
            ) : (
              <View
                style={{
                  flex: 1,
                  margin: heightPercentageToDP(2),
                }}>
                <View
                  style={{
                    marginTop: heightPercentageToDP(3),
                    paddingVertical: heightPercentageToDP(2),
                    gap: heightPercentageToDP(2),
                  }}>
                  <View
                    style={{
                      height: heightPercentageToDP(35),
                      backgroundColor: COLORS.grayHalfBg,
                      marginTop: heightPercentageToDP(-4),
                      borderRadius: heightPercentageToDP(1),
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
                          flex: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Regular,
                            fontSize: heightPercentageToDP(3),
                            marginTop: heightPercentageToDP(1),
                            color: COLORS.black,
                          }}>
                          {filteredData[0].lotlocation.lotlocation}
                        </Text>

                        <GradientText
                          style={{
                            fontSize: heightPercentageToDP(11),
                            color: COLORS.black,
                          }}>
                          {filteredData[0].resultNumber}
                        </GradientText>
                      </View>

                      {/** Top view right container */}
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.gray2,
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            transform: [{rotate: '90deg'}],
                            color: COLORS.black,
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(2),
                          }}>
                          {filteredData[0].lottime.lottime}
                        </Text>
                      </View>
                    </View>

                    {/** Big Result bottom container */}

                    <View
                      style={{
                        flex: 1,
                        backgroundColor: COLORS.white_s,
                        margin: heightPercentageToDP(1),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: heightPercentageToDP(1),
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
                          color: COLORS.black,
                        }}>
                        {filteredData[0].lotdate.lotdate}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={submitHandler}
                    style={{
                      backgroundColor: COLORS.blue,
                      padding: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(1),
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.white,
                        fontFamily: FONT.Montserrat_Regular,
                      }}>
                      Download
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Result;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
});

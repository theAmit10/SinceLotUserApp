import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Background from '../components/background/Background';
import Loading from '../components/helpercComponent/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {getAllLocations} from '../redux/actions/locationAction';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import LinearGradient from 'react-native-linear-gradient';
import {extractMultiplerFromLocation} from '../helper/HelperFunction';

const Search = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken} = useSelector(state => state.user);
  const {loading, locations} = useSelector(state => state.location);

  // const [filteredData, setFilteredData] = useState(locations);
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = text => {
    const filtered = locations.filter(item =>
      item.lotlocation.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(getAllLocations(accesstoken));
  }, [dispatch, focused]);

  useEffect(() => {
    setFilteredData(locations); // Update filteredData whenever locations change
  }, [locations]);

  const submitHandler = () => {
    Toast.show({
      type: 'success',
      text1: 'Searching',
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      {/** Main Cointainer */}

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height:
              Platform.OS === 'android'
                ? heightPercentageToDP(85)
                : heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height:
                Platform.OS === 'android'
                  ? heightPercentageToDP(85)
                  : heightPercentageToDP(80),
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

            {/** Content Container */}

            <View
              style={{
                height: heightPercentageToDP(15),
                margin: heightPercentageToDP(2),
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Search
              </GradientTextWhite>

              <View
                style={{
                  height: heightPercentageToDP(7),
                  flexDirection: 'row',
                  backgroundColor: COLORS.white_s,
                  alignItems: 'center',
                  paddingHorizontal: heightPercentageToDP(2),
                  borderRadius: heightPercentageToDP(1),
                  marginTop: heightPercentageToDP(2),
                }}>
                <Fontisto
                  name={'search'}
                  size={heightPercentageToDP(3)}
                  color={COLORS.darkGray}
                />
                <TextInput
                  style={{
                    marginStart: heightPercentageToDP(1),
                    flex: 1,
                    fontFamily: FONT.Montserrat_Regular,
                    fontSize: heightPercentageToDP(2.5),
                    color: COLORS.black,
                  }}
                  placeholder="Search for location"
                  placeholderTextColor={COLORS.black}
                  label="Search"
                  onChangeText={handleSearch}
                />
              </View>
            </View>

            <View
              style={{
                flex: 2,
              }}>
              {loading ? (
                <Loading />
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('SearchTime', {
                          locationdata: item,
                        })
                      }>
                      <LinearGradient
                        colors={
                          index % 2 === 0
                            ? [COLORS.lightblue, COLORS.midblue]
                            : [COLORS.lightyellow, COLORS.darkyellow]
                        }
                        start={{x: 0, y: 0}} // start from left
                        end={{x: 1, y: 0}} // end at right
                        style={{
                          ...styles.item,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flex: 1.5,
                          }}>
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_SemiBold,
                              fontSize: heightPercentageToDP(2.5),
                            }}>
                            {item.lotlocation}
                          </Text>
                        </View>

                        <View
                          style={{
                            flex: 1,
                          }}>
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.Montserrat_Regular,
                              fontSize: heightPercentageToDP(2),
                            }}>
                            {extractMultiplerFromLocation(item.maximumRange)}{' '}
                            Win
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item._id}
                  initialNumToRender={10} // Render initial 10 items
                  maxToRenderPerBatch={10} // Batch size to render
                  windowSize={10} // Number of items kept in memory
                />
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: heightPercentageToDP(20),
  },
  item: {
    padding: heightPercentageToDP(2),
    marginVertical: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
});

// {/* <View
//           style={{
//             marginBottom: heightPercentageToDP(5),
//             marginHorizontal: heightPercentageToDP(2),
//             marginTop: heightPercentageToDP(2),
//           }}>
//           {/** Email container */}

//           <TouchableOpacity
//             onPress={submitHandler}
//             style={{
//               backgroundColor: COLORS.blue,
//               padding: heightPercentageToDP(2),
//               borderRadius: heightPercentageToDP(1),
//               alignItems: 'center',
//             }}>
//             <Text
//               style={{
//                 color: COLORS.white,
//                 fontFamily: FONT.Montserrat_Regular,
//               }}>
//               Submit
//             </Text>
//           </TouchableOpacity>
//         </View> */}

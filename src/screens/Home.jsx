import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONT} from '../../assets/constants';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import GradientText from '../components/helpercComponent/GradientText';
import Wallet from '../components/home/Wallet';
import {useDispatch, useSelector} from 'react-redux';
import {loadProfile} from '../redux/actions/userAction';
import HomeLoading from '../components/background/HomeLoading';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import {getAllResult} from '../redux/actions/resultAction';
import BigResult from '../components/home/BigResult';

const Home = () => {
  const {user, accesstoken, loading} = useSelector(state => state.user);

  // Currently working on the Withdraw through Upi Section of the Crypto Project

  const navigation = useNavigation();

  const [data, setData] = useState([
    {id: '1', result: '7894', location: 'Pune', time: '01:00 PM'},
    {id: '2', result: '1839', location: 'Sikkim', time: '01:00 PM'},
    {id: '3', result: '7456', location: 'Bhopal', time: '01:00 PM'},
  ]);

  // Getting User Profile

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProfile(accesstoken));
  }, [dispatch]);

  // for backPress handling
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const {results} = useSelector(state => state.result);
  const [filteredData, setFilteredData] = useState([]);
  const focused = useIsFocused();

  useEffect(() => {
    dispatch(getAllResult(accesstoken));
  }, [dispatch, focused]);

  useEffect(() => {
    const firstThreeElements = results.slice(1, 4);
    setFilteredData(firstThreeElements); // Update filteredData whenever locations change
  }, [results]);

  console.log('filter data :: ' + filteredData.length);

  console.log('Welcome :: ' + JSON.stringify(user));
  console.log('Welcome Access token :: ' + accesstoken);

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: COLORS.white,
        padding: heightPercentageToDP(2),
      }}>
      {loading ? (
        <HomeLoading />
      ) : (
        user && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/** TOP HEADER CONTAINER */}
            <View
              style={{
                height: heightPercentageToDP(10),
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 3,

                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: heightPercentageToDP(1),
                }}>
                {/** Profile Image Container */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={{
                    borderRadius: 100,
                    overflow: 'hidden',
                    width: 70,
                    height: 70,
                  }}>
                  <Image
                    // source={{ uri: 'https://imgs.search.brave.com/bNjuaYsTPw2b4yerAkKyk82fwZ9sNFwkwb3JMnX7qBg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NDU5OTYxMjQtMDUw/MWViYWU4NGQwP3E9/ODAmdz0xMDAwJmF1/dG89Zm9ybWF0JmZp/dD1jcm9wJml4bGli/PXJiLTQuMC4zJml4/aWQ9TTN3eE1qQTNm/REI4TUh4elpXRnlZ/Mmg4TWpCOGZHWmhZ/MlY4Wlc1OE1IeDhN/SHg4ZkRBPQ.jpeg' }}
                    source={require('../../assets/image/dummy_user.jpeg')}
                    resizeMode="cover"
                    style={{
                      height: 70,
                      width: 70,
                    }}
                  />
                </TouchableOpacity>

                {/** Profile name Container */}
                <View>
                  <Text
                    style={{
                      fontFamily: FONT.Montserrat_Regular,
                      color: COLORS.black,
                    }}>
                    Hello
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONT.HELVETICA_BOLD,
                      color: COLORS.black,
                      fontSize: heightPercentageToDP(2),
                    }}>
                    {user.name}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: heightPercentageToDP(2),
                 
                }}>

                <TouchableOpacity
                  >
                  <Ionicons
                    name={'notifications'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.black}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}>
                  <Entypo
                    name={'menu'}
                    size={heightPercentageToDP(3)}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/** SEARCH CONTAINER */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayHalfBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
                marginTop: heightPercentageToDP(2),
              }}>
              <Fontisto
                name={'search'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                }}>
                Search for location
              </Text>
            </TouchableOpacity>

                        {/** BIG RESULT  */}

                        {results.length === 0 ? (
              <NoDataFound data={'No Result Available'} />
            ) : (
              <BigResult data={results[0]} />
            )}

            {/** BOTTOM RESULT CONTAINER */}

            <View
              style={{
                height: heightPercentageToDP(5),

                marginVertical: heightPercentageToDP(2),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <GradientText
                style={{
                  fontSize: heightPercentageToDP(4),
                  fontFamily: FONT.Montserrat_Bold,
                }}>
                Results
              </GradientText>

              <Text
                onPress={() => navigation.navigate('AllResult')}
                style={{
                  fontFamily: FONT.Montserrat_Regular,
                  fontSize: heightPercentageToDP(2),
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                See all
              </Text>
            </View>

            {/** BOTTOM RESULT CONTENT CONTAINER */}

            {filteredData.length === 0 ? (
              <NoDataFound data={'No Result Available'} />
            ) : (
              <View
                style={{
                  height: heightPercentageToDP(25),
                  borderRadius: heightPercentageToDP(1),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: heightPercentageToDP(2),
                }}>
                <ScrollView
                  horizontal={true}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}>
                  {filteredData.map((item, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ResultDetails', {data: item})
                      }
                      key={index}
                      style={{
                        height: heightPercentageToDP(20),
                        width: widthPercentageToDP(30),
                        borderRadius: heightPercentageToDP(1),
                        backgroundColor: 'gray',
                        ...styles.resultContentContainer,
                        position: 'relative',
                      }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor:
                            index % 2 === 0
                              ? COLORS.grayHalfBg
                              : COLORS.lightDarkGray,
                          borderTopRightRadius: heightPercentageToDP(1),
                          borderTopLeftRadius: heightPercentageToDP(1),
                          paddingTop: heightPercentageToDP(1),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(2),
                            textAlign: 'center',
                          }}>
                          {item.lotlocation.lotlocation}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: 'transparent',
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_SemiBold,
                            fontSize: heightPercentageToDP(5),
                            textAlign: 'center',
                          }}>
                          {item.resultNumber}
                        </Text>
                      </View>

                      <View
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.white_s,
                          borderBottomRightRadius: heightPercentageToDP(1),
                          borderBottomLeftRadius: heightPercentageToDP(1),
                          justifyContent: 'flex-end',
                          margin: heightPercentageToDP(0.5),
                        }}>
                        <Text
                          style={{
                            fontFamily: FONT.Montserrat_Regular,
                            fontSize: heightPercentageToDP(2),
                            textAlign: 'center',
                            padding: heightPercentageToDP(0.5),
                          }}>
                          {item.lottime.lottime}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/** PROMOTION CONTAINER */}

            <NoDataFound data={'Promotions'} />

            {/** WALLET CONTAINER */}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WalletBalance', {data: user.walletOne})
                }>
                <Wallet wallet={user.walletOne} />
              </TouchableOpacity>

                <TouchableOpacity
                onPress={() =>
                  navigation.navigate('WalletBalance', {data: user.walletTwo})
                }>
                <Wallet wallet={user.walletTwo} />
                </TouchableOpacity>
              
            </ScrollView>

            



          </ScrollView>
        )
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  resultContentContainer: {
    // Add shadow properties
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
    // Add border radius and margin properties
    borderRadius: 8,
    margin: 10,
    // Add background color and any other styles you need
    backgroundColor: '#fff',
  },
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
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

{
  /* <View
          style={{
            flexDirection: 'row',
          }}>
          <Text
            style={{
              transform: [{rotate: '90deg'}],
              color: COLORS.black,
              fontFamily: FONT.SF_PRO_MEDIUM,
              fontSize: heightPercentageToDP(2),
            }}>
            Balance
          </Text>
          <Text
            style={{
              transform: [{rotate: '90deg'}],
              color: COLORS.black,
              fontFamily: FONT.SF_PRO_MEDIUM,
              fontSize: heightPercentageToDP(2),
              marginStart: -20,
            }}>
            Total
          </Text>
        </View> */
}

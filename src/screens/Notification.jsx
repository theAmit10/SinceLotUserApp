import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
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
import {getAllResult} from '../redux/actions/resultAction';
import NoDataFound from '../components/helpercComponent/NoDataFound';
import {loadAllNotification} from '../redux/actions/userAction';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';
import { useCheckNotificationSeenMutation } from '../helper/Networkcall';

const Notification = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, user, notifications, loadingNotification} = useSelector(
    state => state.user,
  );

  const focused = useIsFocused();

  useEffect(() => {
    dispatch(loadAllNotification(accesstoken, user._id));
  }, [dispatch, focused]);


  useEffect(() => {
    if (!loadingNotification && notifications) {
      submitHandler();
    }
  }, [loadingNotification, notifications]);

  const [checkNotificationSeen, { isLoading, error }] =
    useCheckNotificationSeenMutation();

  const submitHandler = async () => {
    try {
      const res = await checkNotificationSeen({
        accessToken: accesstoken,
        id: user._id,
      }).unwrap();

      console.log('seen status res :: ' + JSON.stringify(res));
    } catch (error) {
      console.log('Error during submitHandler:', error);
    }
  };


  

  
  


  return (
    <SafeAreaView style={{flex: 1}}>
      <Background />

      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <ImageBackground
          source={require('../../assets/image/tlwbg.jpg')}
          style={{
            width: '100%',
            height: heightPercentageToDP(80),
          }}
          imageStyle={{
            borderTopLeftRadius: heightPercentageToDP(5),
            borderTopRightRadius: heightPercentageToDP(5),
          }}>
          <View
            style={{
              height: heightPercentageToDP(80),
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

            <View
              style={{
                margin: heightPercentageToDP(2),
                backgroundColor: 'transparent',
              }}>
              <GradientTextWhite style={styles.textStyle}>
                Notification
              </GradientTextWhite>
            </View>

            {/** Content Container */}

            <ScrollView showsVerticalScrollIndicator={false}>
              {loadingNotification ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: heightPercentageToDP(2),
                  }}>
                  <Loading />
                </View>
              ) : notifications && notifications.length === 0 ? (
                <View
                  style={{
                    height: heightPercentageToDP(30),
                    margin: heightPercentageToDP(2),
                  }}>
                  <NoDataFound data={'No data available '} />
                </View>
              ) : (
                notifications?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      height: heightPercentageToDP(11),
                      backgroundColor: COLORS.white_s,
                      margin: heightPercentageToDP(2),
                      padding: heightPercentageToDP(2),
                      borderRadius: heightPercentageToDP(2),
                    }}>
                    <Text
                      style={{
                        color: COLORS.black,
                        fontFamily: FONT.Montserrat_SemiBold,
                        fontSize: heightPercentageToDP(2),
                      }}
                      numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        color: COLORS.black,
                        fontFamily: FONT.Montserrat_Regular,
                        fontSize: heightPercentageToDP(2),
                      }}
                      numberOfLines={2}>
                      {item.description}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>

      {/** Main Cointainer */}
    </SafeAreaView>
  );
};

export default Notification;

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
    marginVertical: heightPercentageToDP(1),
    marginHorizontal: heightPercentageToDP(2),
    borderRadius: heightPercentageToDP(1),
  },
  title: {
    color: COLORS.white_s,
    fontFamily: FONT.SF_PRO_MEDIUM,
  },
});

// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';

// import {
//   heightPercentageToDP,
//   widthPercentageToDP,
// } from 'react-native-responsive-screen';
// import {COLORS, FONT} from '../../assets/constants';
// import GradientText from '../components/helpercComponent/GradientText';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import Background from '../components/background/Background';
// import Loading from '../components/helpercComponent/Loading';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllLocations } from '../redux/actions/locationAction';
// import { loadAllNotification } from '../redux/actions/userAction';

// const Notification = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const {accesstoken} = useSelector(state => state.user);
//   const {loadingNotification,notifications} = useSelector(state => state.location);

//   // const [filteredData, setFilteredData] = useState(locations);
//   const [filteredData, setFilteredData] = useState([]);

//   const handleSearch = text => {
//     const filtered = notifications.filter(item =>
//       item.title.toLowerCase().includes(text.toLowerCase()),
//     );
//     setFilteredData(filtered);
//   };

//   const focused = useIsFocused()

//   useEffect(() => {
//     dispatch(loadAllNotification(accesstoken))
//   },[dispatch,focused])

//   useEffect(() => {
//     setFilteredData(notifications); // Update filteredData whenever locations change
//   }, [notifications]);

//   return (
//     <View style={{flex: 1}}>
//       <Background />

//       {/** Main Cointainer */}

//       <View
//         style={{
//           height: heightPercentageToDP(85),
//           width: widthPercentageToDP(100),
//           backgroundColor: COLORS.white_s,
//           borderTopLeftRadius: heightPercentageToDP(5),
//           borderTopRightRadius: heightPercentageToDP(5),
//         }}>
//         {/** Top Style View */}
//         <View
//           style={{
//             height: heightPercentageToDP(5),
//             width: widthPercentageToDP(100),
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <View
//             style={{
//               width: widthPercentageToDP(20),
//               height: heightPercentageToDP(0.8),
//               backgroundColor: COLORS.grayBg,
//               borderRadius: heightPercentageToDP(2),
//             }}></View>
//         </View>

//         {/** Content Container */}

//         <View
//           style={{
//             height: heightPercentageToDP(15),
//             margin: heightPercentageToDP(2),
//           }}>
//           <GradientText style={styles.textStyle}>Notification</GradientText>
//         </View>

//         <View
//           style={{
//             flex: 2,
//           }}>
//             {
//                 loadingNotification ? (<Loading/>) : (
//                 <FlatList
//                     data={filteredData}
//                     renderItem={({item, index}) => (
//                       <TouchableOpacity

//                       onPress={() => navigation.navigate("SearchTime",{
//                         locationdata: item,
//                       })}
//                         style={{
//                           ...styles.item,
//                           backgroundColor:
//                             index % 2 === 0 ? COLORS.lightDarkGray : COLORS.grayHalfBg,
//                           flexDirection: 'row',
//                           justifyContent: 'space-between'
//                         }}>
//                           <View style={{
//                             flex: 1.5
//                           }}>
//                           <Text
//                           style={{
//                             color: COLORS.black,
//                             fontFamily: FONT.Montserrat_SemiBold,
//                             fontSize: heightPercentageToDP(2.5),
//                           }}>
//                           {item.title}
//                         </Text>
//                           </View>

//                       </TouchableOpacity>
//                     )}
//                     keyExtractor={item => item._id}
//                     initialNumToRender={10} // Render initial 10 items
//                     maxToRenderPerBatch={10} // Batch size to render
//                     windowSize={10} // Number of items kept in memory
//                   />)
//             }

//         </View>

//         {/** Bottom Submit Container */}

//         {/** end */}
//       </View>
//     </View>
//   );
// };

// export default Notification;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color:COLORS.black
//   },
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 20,
//     height: heightPercentageToDP(20),
//   },
//   item: {
//     padding: heightPercentageToDP(2),
//     marginVertical: heightPercentageToDP(1),
//     marginHorizontal: heightPercentageToDP(2),
//     borderRadius: heightPercentageToDP(1),
//   },
//   title: {
//     color: COLORS.white_s,
//     fontFamily: FONT.SF_PRO_MEDIUM,
//   },
// });

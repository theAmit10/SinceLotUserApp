import React, {useEffect, useState, useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  useCreateSubPartnerMutation,
  useGetPartnerUserListQuery,
  useRemoveUserFromUserListMutation,
  useSearchPartnerUserListQuery,
} from '../../helper/Networkcall';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONT} from '../../../assets/constants';
import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

const AllPartnerUsers = ({route}) => {
  const {accesstoken, user} = useSelector(state => state.user);
  // States
  const [partners, setPartners] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce Effect for Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Paginated Data
  const {
    data: paginatedData,
    refetch: refetchPaginated,
    isFetching: fetchingPaginated,
  } = useGetPartnerUserListQuery(
    {accesstoken, userId: user.userId, page, limit},
    {skip: debouncedSearch.length > 0}, // Skip pagination if searching
  );

  // Fetch Search Data
  const {data: searchData, isFetching: fetchingSearch} =
    useSearchPartnerUserListQuery(
      debouncedSearch.length > 0
        ? {accesstoken, userId: user.userId, query: debouncedSearch}
        : {skip: true},
    );

  // Reset State on Navigation Back
  useFocusEffect(
    useCallback(() => {
      // setPartners([]); // ✅ Reset Data
      setPage(1); // ✅ Reset Page
      setHasMore(true); // ✅ Reset Load More
      refetchPaginated?.(); // ✅ Ensure Fresh Data
    }, [refetchPaginated]),
  );

  useEffect(() => {
    setLoading(true);

    if (debouncedSearch.length > 0 && searchData?.userList) {
      // For search results, replace the existing data
      setPartners(searchData.userList);
      setHasMore(false); // Disable pagination when searching
    } else if (paginatedData?.userList) {
      // For paginated data, filter out duplicates before appending
      setPartners(prev => {
        const newData = paginatedData.userList.filter(
          newItem => !prev.some(prevItem => prevItem._id === newItem._id),
        );
        return page === 1 ? paginatedData.userList : [...prev, ...newData];
      });

      // Update `hasMore` based on the length of the new data
      if (paginatedData.userList.length < limit) {
        setHasMore(false); // No more data to fetch
      } else {
        setHasMore(true); // More data available
      }
    }

    setLoading(false);
  }, [searchData, paginatedData, debouncedSearch, page]);

  const loadMore = () => {
    if (!loading && hasMore && debouncedSearch.length === 0) {
      setPage(prev => prev + 1);
    }
  };

  // Combined Loading State
  const isLoading = fetchingPaginated || fetchingSearch || loading;

  const [createSubPartner, {isLoading: subIsLoading, error: subError}] =
    useCreateSubPartnerMutation();

  const [removeUserFromUserList, {isLoading: removeIsLoading}] =
    useRemoveUserFromUserListMutation();

  const makePartner = async item => {
    console.log(item);
    setSelectedItem(item);
    setShowProgressBar(true);

    try {
      const res = await createSubPartner({
        accesstoken,
        body: {
          userId: item.userId,
          parentId: user.userId,
        },
      }).unwrap();
      console.log('res :: ' + JSON.stringify(res));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.data.message || 'Partner added successfully',
      });
      await refetch();
    } catch (e) {
      console.log(e);
    }

    setShowProgressBar(false);
  };

  const removePartner = async item => {
    console.log(item);
    setSelectedItem(item);
    // setShowProgressBar(true);
    Toast.show({
      type: 'info',
      text1: 'Admin mode',
      text2: 'Admin can only remove partner',
    });

    // try {
    //   const res = await removeUserFromUserList({
    //     accesstoken,
    //     id: item._id,
    //     partnerId: user.userId,
    //   });

    //   console.log(JSON.stringify(res));
    //   Toast.show({
    //     type: 'success',
    //     text1: 'Success',
    //     text2: res.message || 'Partner removed successfully',
    //   });
    // } catch (e) {
    //   console.log(e);
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error',
    //     text2: 'Error in removing partner',
    //   });
    // }
  };

  const [showProgressBar, setShowProgressBar] = useState(false);
  const [seletectedItem, setSelectedItem] = useState('');

  return (
    <MainBackgroundWithoutScrollview title="All Users">
      <View style={{flex: 1}}>
        {/* SEARCH INPUT */}
        <View
          style={{
            height: heightPercentageToDP(7),
            flexDirection: 'row',
            backgroundColor: COLORS.white_s,
            alignItems: 'center',
            paddingHorizontal: heightPercentageToDP(2),
            borderRadius: heightPercentageToDP(1),
            marginHorizontal: heightPercentageToDP(1),
          }}>
          <Fontisto
            name="search"
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
            placeholder="Search for User"
            placeholderTextColor={COLORS.black}
            onChangeText={text => {
              setLoading(true);
              setSearchQuery(text);
            }}
          />
        </View>

        {/* PARTNER USER LIST */}
        <View style={{flex: 1, padding: heightPercentageToDP(1)}}>
          {isLoading && page === 1 ? (
            <ActivityIndicator size="large" color={COLORS.white_s} />
          ) : (
            <FlatList
              data={partners}
              keyExtractor={item => item._id.toString()} // Ensure _id is unique
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('PartnerUserProfile', {item})
                  }
                  key={index}>
                  <LinearGradient
                    colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
                    start={{x: 0, y: 0}} // start from left
                    end={{x: 1, y: 0}} // end at right
                    style={styles.paymentOption}>
                    <View
                      style={{
                        flex: 1,
                        height: '100%',
                      }}>
                      <View style={styles.topContainer}>
                        <View
                          style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={styles.titleRegular}>User ID</Text>
                          <Text style={styles.titleBold}>{item.userId}</Text>
                        </View>
                        <View
                          style={{
                            flex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={styles.titleRegular}>Name</Text>
                          <Text style={styles.titleBold} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.centerLine}></View>
                      <View style={styles.bottomContainer}>
                        {item.partnerType === 'user' ? (
                          showProgressBar ? (
                            seletectedItem._id === item._id ? (
                              <Loading />
                            ) : (
                              <TouchableOpacity
                                onPress={() => makePartner(item)}
                                style={{
                                  borderRadius: heightPercentageToDP(2),
                                }}>
                                <LinearGradient
                                  colors={[
                                    COLORS.user_firstgreen,
                                    COLORS.time_secondgreen,
                                  ]}
                                  start={{x: 0, y: 0}} // start from left
                                  end={{x: 1, y: 0}} // end at right
                                  style={{
                                    padding: heightPercentageToDP(1.5),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: heightPercentageToDP(2),
                                    flexDirection: 'row',
                                    gap: heightPercentageToDP(1),
                                  }}>
                                  <FontAwesome
                                    name={'edit'}
                                    size={heightPercentageToDP(3)}
                                    color={COLORS.black}
                                    style={styles.icon}
                                  />

                                  <Text style={styles.titleSemiBold}>
                                    Make Partner
                                  </Text>
                                </LinearGradient>
                              </TouchableOpacity>
                            )
                          ) : (
                            <TouchableOpacity
                              onPress={() => makePartner(item)}
                              style={{
                                borderRadius: heightPercentageToDP(2),
                              }}>
                              <LinearGradient
                                colors={[
                                  COLORS.user_firstgreen,
                                  COLORS.time_secondgreen,
                                ]}
                                start={{x: 0, y: 0}} // start from left
                                end={{x: 1, y: 0}} // end at right
                                style={{
                                  padding: heightPercentageToDP(1.5),
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: heightPercentageToDP(2),
                                  flexDirection: 'row',
                                  gap: heightPercentageToDP(1),
                                }}>
                                <FontAwesome
                                  name={'edit'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.black}
                                  style={styles.icon}
                                />

                                <Text style={styles.titleSemiBold}>
                                  Make Partner
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          )
                        ) : showProgressBar ? (
                          seletectedItem._id === item._id ? (
                            <Loading />
                          ) : (
                            <TouchableOpacity
                              onPress={() => removePartner(item)}
                              style={{
                                borderRadius: heightPercentageToDP(2),
                              }}>
                              <LinearGradient
                                colors={[COLORS.red, COLORS.red]}
                                start={{x: 0, y: 0}} // start from left
                                end={{x: 1, y: 0}} // end at right
                                style={{
                                  padding: heightPercentageToDP(1.5),
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: heightPercentageToDP(2),
                                  flexDirection: 'row',
                                  gap: heightPercentageToDP(1),
                                }}>
                                <MaterialCommunityIcons
                                  name={'delete'}
                                  size={heightPercentageToDP(3)}
                                  color={COLORS.black}
                                  style={styles.icon}
                                />

                                <Text style={styles.titleSemiBold}>
                                  Remove Partner
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          )
                        ) : (
                          <TouchableOpacity
                            onPress={() => removePartner(item)}
                            style={{
                              borderRadius: heightPercentageToDP(2),
                            }}>
                            <LinearGradient
                              colors={[COLORS.red, COLORS.red]}
                              start={{x: 0, y: 0}} // start from left
                              end={{x: 1, y: 0}} // end at right
                              style={{
                                padding: heightPercentageToDP(1.5),
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: heightPercentageToDP(2),
                                flexDirection: 'row',
                                gap: heightPercentageToDP(1),
                              }}>
                              <MaterialCommunityIcons
                                name={'delete'}
                                size={heightPercentageToDP(3)}
                                color={COLORS.black}
                                style={styles.icon}
                              />

                              <Text style={styles.titleSemiBold}>
                                Remove Partner
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={() =>
                hasMore && isLoading ? (
                  <ActivityIndicator size="large" color={COLORS.white_s} />
                ) : null
              }
            />
          )}
        </View>
      </View>
    </MainBackgroundWithoutScrollview>
  );
};

export default AllPartnerUsers;

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
  paymentOption: {
    backgroundColor: 'pink',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP(15),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  iconContainer: {
    backgroundColor: COLORS.white_s,
    padding: heightPercentageToDP(1.5),
    borderRadius: heightPercentageToDP(1),
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleContent: {
    fontSize: heightPercentageToDP(3),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  topContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  bottomContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLine: {
    height: 1,
    backgroundColor: COLORS.white_s,
  },
  titleRegular: {
    fontSize: heightPercentageToDP(1.5),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Regular,
  },
  titleBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.black,
    fontFamily: FONT.Montserrat_Bold,
  },
  titleSemiBold: {
    fontSize: heightPercentageToDP(2),
    color: COLORS.white_s,
    fontFamily: FONT.Montserrat_Bold,
  },
  acceptBtn: {
    backgroundColor: COLORS.green,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(0.5),
    borderRadius: heightPercentageToDP(2),
  },
});

// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   ScrollView,
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
// import Entypo from 'react-native-vector-icons/Entypo';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Toast from 'react-native-toast-message';
// import {useIsFocused, useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import Background from '../../components/background/Background';
// import {COLORS, FONT} from '../../../assets/constants';
// import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
// import GradientText from '../../components/helpercComponent/GradientText';
// import Loading from '../../components/helpercComponent/Loading';
// import {
//   useCreateSubPartnerMutation,
//   useGetPartnerUserListQuery,
//   useRemoveUserFromUserListMutation,
// } from '../../helper/Networkcall';
// import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';

// const dummeyAllUsers = [
//   {
//     userid: '1090',
//     name: 'Babu Roa',
//     partner: true,
//   },
//   {
//     userid: '1091',
//     name: 'Arjuna',
//     partner: true,
//   },
//   {
//     userid: '1092',
//     name: 'Mark Jone',
//     partner: false,
//   },
//   {
//     userid: '1093',
//     name: 'Janny Mona',
//     partner: true,
//   },
//   {
//     userid: '1094',
//     name: 'Lucy cina',
//     partner: true,
//   },
// ];
// const AllPartnerUsers = () => {
//   const navigation = useNavigation();
//   const {accesstoken, user} = useSelector(state => state.user);
//   const [filteredData, setFilteredData] = useState([]);
//   const handleSearch = text => {
//     const filtered = data?.userList?.filter(
//       item =>
//         item.name.toLowerCase().includes(text.toLowerCase()) ||
//         item.userId?.toString() === text,
//     );
//     setFilteredData(filtered);
//   };

//   const userId = user.userId;

//   const {isLoading, data, error, refetch} = useGetPartnerUserListQuery({
//     accesstoken,
//     userId,
//   });

//   const [createSubPartner, {isLoading: subIsLoading, error: subError}] =
//     useCreateSubPartnerMutation();

//   const [removeUserFromUserList, {isLoading: removeIsLoading}] =
//     useRemoveUserFromUserListMutation();

//   useEffect(() => {
//     if (!isLoading && data) {
//       setFilteredData(data.userList);
//       console.log('Getting all users');
//       console.log(data);
//     }
//     if (error) {
//       console.log(error);
//       Toast.show({
//         type: 'error',
//         text1: 'Error',
//         text2: 'Error in getting all users',
//       });
//     }
//   }, [data, isLoading, error]);

//   const makePartner = async item => {
//     console.log(item);
//     setSelectedItem(item);
//     setShowProgressBar(true);

//     try {
//       const res = await createSubPartner({
//         accesstoken,
//         body: {
//           userId: item.userId,
//           parentId: user.userId,
//         },
//       }).unwrap();
//       console.log('res :: ' + JSON.stringify(res));
//       Toast.show({
//         type: 'success',
//         text1: 'Success',
//         text2: res.data.message || 'Partner added successfully',
//       });
//       await refetch();
//     } catch (e) {
//       console.log(e);
//     }

//     setShowProgressBar(false);
//   };

//   const removePartner = async item => {
//     console.log(item);
//     setSelectedItem(item);
//     // setShowProgressBar(true);
//     Toast.show({
//       type: 'info',
//       text1: 'Admin mode',
//       text2: 'Admin can only remove partner',
//     });

//     // try {
//     //   const res = await removeUserFromUserList({
//     //     accesstoken,
//     //     id: item._id,
//     //     partnerId: user.userId,
//     //   });

//     //   console.log(JSON.stringify(res));
//     //   Toast.show({
//     //     type: 'success',
//     //     text1: 'Success',
//     //     text2: res.message || 'Partner removed successfully',
//     //   });
//     // } catch (e) {
//     //   console.log(e);
//     //   Toast.show({
//     //     type: 'error',
//     //     text1: 'Error',
//     //     text2: 'Error in removing partner',
//     //   });
//     // }
//   };

//   const [showProgressBar, setShowProgressBar] = useState(false);
//   const [seletectedItem, setSelectedItem] = useState('');

//   return (
//     <MainBackgroundWithoutScrollview title={'All Users'}>
//       <View
//         style={{
//           flex: 1,
//           padding: heightPercentageToDP(1),
//         }}>
//         <View
//           style={{
//             height: heightPercentageToDP(7),
//             flexDirection: 'row',
//             backgroundColor: COLORS.white_s,
//             alignItems: 'center',
//             paddingHorizontal: heightPercentageToDP(2),
//             borderRadius: heightPercentageToDP(1),
//           }}>
//           <Fontisto
//             name={'search'}
//             size={heightPercentageToDP(3)}
//             color={COLORS.darkGray}
//           />
//           <TextInput
//             style={{
//               marginStart: heightPercentageToDP(1),
//               flex: 1,
//               fontFamily: FONT.Montserrat_SemiBold,
//               fontSize: heightPercentageToDP(2),
//               color: COLORS.black,
//             }}
//             placeholder="Search for User"
//             placeholderTextColor={COLORS.black}
//             label="Search"
//             onChangeText={handleSearch}
//           />
//         </View>
//         {isLoading ? (
//           <Loading />
//         ) : (
//           <FlatList
//             showsVerticalScrollIndicator={false}
//             data={filteredData}
//             keyExtractor={item => item._id}
//             renderItem={({item, index}) => (
//               <TouchableOpacity
//                 onPress={() =>
//                   navigation.navigate('PartnerUserProfile', {item})
//                 }
//                 key={index}>
//                 <LinearGradient
//                   colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
//                   start={{x: 0, y: 0}} // start from left
//                   end={{x: 1, y: 0}} // end at right
//                   style={styles.paymentOption}>
//                   <View
//                     style={{
//                       flex: 1,
//                       height: '100%',
//                     }}>
//                     <View style={styles.topContainer}>
//                       <View
//                         style={{
//                           flex: 1,
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'flex-start',
//                         }}>
//                         <Text style={styles.titleRegular}>User ID</Text>
//                         <Text style={styles.titleBold}>{item.userId}</Text>
//                       </View>
//                       <View
//                         style={{
//                           flex: 2,
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'flex-start',
//                         }}>
//                         <Text style={styles.titleRegular}>Name</Text>
//                         <Text style={styles.titleBold} numberOfLines={1}>
//                           {item.name}
//                         </Text>
//                       </View>
//                     </View>
//                     <View style={styles.centerLine}></View>
//                     <View style={styles.bottomContainer}>
//                       {item.partnerType === 'user' ? (
//                         showProgressBar ? (
//                           seletectedItem._id === item._id ? (
//                             <Loading />
//                           ) : (
//                             <TouchableOpacity
//                               onPress={() => makePartner(item)}
//                               style={{
//                                 borderRadius: heightPercentageToDP(2),
//                               }}>
//                               <LinearGradient
//                                 colors={[
//                                   COLORS.user_firstgreen,
//                                   COLORS.time_secondgreen,
//                                 ]}
//                                 start={{x: 0, y: 0}} // start from left
//                                 end={{x: 1, y: 0}} // end at right
//                                 style={{
//                                   padding: heightPercentageToDP(1.5),
//                                   justifyContent: 'center',
//                                   alignItems: 'center',
//                                   borderRadius: heightPercentageToDP(2),
//                                   flexDirection: 'row',
//                                   gap: heightPercentageToDP(1),
//                                 }}>
//                                 <FontAwesome
//                                   name={'edit'}
//                                   size={heightPercentageToDP(3)}
//                                   color={COLORS.black}
//                                   style={styles.icon}
//                                 />

//                                 <Text style={styles.titleSemiBold}>
//                                   Make Partner
//                                 </Text>
//                               </LinearGradient>
//                             </TouchableOpacity>
//                           )
//                         ) : (
//                           <TouchableOpacity
//                             onPress={() => makePartner(item)}
//                             style={{
//                               borderRadius: heightPercentageToDP(2),
//                             }}>
//                             <LinearGradient
//                               colors={[
//                                 COLORS.user_firstgreen,
//                                 COLORS.time_secondgreen,
//                               ]}
//                               start={{x: 0, y: 0}} // start from left
//                               end={{x: 1, y: 0}} // end at right
//                               style={{
//                                 padding: heightPercentageToDP(1.5),
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 borderRadius: heightPercentageToDP(2),
//                                 flexDirection: 'row',
//                                 gap: heightPercentageToDP(1),
//                               }}>
//                               <FontAwesome
//                                 name={'edit'}
//                                 size={heightPercentageToDP(3)}
//                                 color={COLORS.black}
//                                 style={styles.icon}
//                               />

//                               <Text style={styles.titleSemiBold}>
//                                 Make Partner
//                               </Text>
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         )
//                       ) : showProgressBar ? (
//                         seletectedItem._id === item._id ? (
//                           <Loading />
//                         ) : (
//                           <TouchableOpacity
//                             onPress={() => removePartner(item)}
//                             style={{
//                               borderRadius: heightPercentageToDP(2),
//                             }}>
//                             <LinearGradient
//                               colors={[COLORS.red, COLORS.red]}
//                               start={{x: 0, y: 0}} // start from left
//                               end={{x: 1, y: 0}} // end at right
//                               style={{
//                                 padding: heightPercentageToDP(1.5),
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 borderRadius: heightPercentageToDP(2),
//                                 flexDirection: 'row',
//                                 gap: heightPercentageToDP(1),
//                               }}>
//                               <MaterialCommunityIcons
//                                 name={'delete'}
//                                 size={heightPercentageToDP(3)}
//                                 color={COLORS.black}
//                                 style={styles.icon}
//                               />

//                               <Text style={styles.titleSemiBold}>
//                                 Remove Partner
//                               </Text>
//                             </LinearGradient>
//                           </TouchableOpacity>
//                         )
//                       ) : (
//                         <TouchableOpacity
//                           onPress={() => removePartner(item)}
//                           style={{
//                             borderRadius: heightPercentageToDP(2),
//                           }}>
//                           <LinearGradient
//                             colors={[COLORS.red, COLORS.red]}
//                             start={{x: 0, y: 0}} // start from left
//                             end={{x: 1, y: 0}} // end at right
//                             style={{
//                               padding: heightPercentageToDP(1.5),
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                               borderRadius: heightPercentageToDP(2),
//                               flexDirection: 'row',
//                               gap: heightPercentageToDP(1),
//                             }}>
//                             <MaterialCommunityIcons
//                               name={'delete'}
//                               size={heightPercentageToDP(3)}
//                               color={COLORS.black}
//                               style={styles.icon}
//                             />

//                             <Text style={styles.titleSemiBold}>
//                               Remove Partner
//                             </Text>
//                           </LinearGradient>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>
//                 </LinearGradient>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </View>
//     </MainBackgroundWithoutScrollview>
//   );
// };

// export default AllPartnerUsers;

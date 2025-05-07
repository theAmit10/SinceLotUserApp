import React, {useEffect, useState, useCallback} from 'react';
import {ActivityIndicator, FlatList, TextInput, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

import {heightPercentageToDP} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {COLORS, FONT} from '../../../assets/constants';
import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';
import AllPartnerComp from '../../components/partner/AllPartnerComp';
import {
  useGetPartnerPartnerListQuery,
  useSearchPartnerPartnerListQuery,
} from '../../helper/Networkcall';

const AllPartner = () => {
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
  } = useGetPartnerPartnerListQuery(
    {accesstoken, userid: user.userId, page, limit},
    {skip: debouncedSearch.length > 0}, // Skip pagination if searching
  );

  // Fetch Search Data
  const {data: searchData, isFetching: fetchingSearch} =
    useSearchPartnerPartnerListQuery(
      debouncedSearch.length > 0
        ? {accesstoken, userId: user.userId, query: debouncedSearch}
        : {skip: true},
    );

  console.log(JSON.stringify(paginatedData?.partnerList));

  // Reset State on Navigation Back
  useFocusEffect(
    useCallback(() => {
      // setPartners([]); // ✅ Reset Data
      setPage(1); // ✅ Reset Page
      setHasMore(true); // ✅ Reset Load More
      refetchPaginated(); // ✅ Ensure Fresh Data
    }, [refetchPaginated]),
  );

  useEffect(() => {
    setLoading(true);

    if (debouncedSearch.length > 0 && searchData?.partnerList) {
      // For search results, replace the existing data
      setPartners(searchData.partnerList);
      setHasMore(false); // Disable pagination when searching
    } else if (paginatedData?.partnerList) {
      // For paginated data, filter out duplicates before appending
      setPartners(prev => {
        const newData = paginatedData.partnerList.filter(
          newItem => !prev.some(prevItem => prevItem._id === newItem._id),
        );
        return page === 1 ? paginatedData.partnerList : [...prev, ...newData];
      });

      // Update `hasMore` based on the length of the new data
      if (paginatedData.partnerList.length < limit) {
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

  return (
    <MainBackgroundWithoutScrollview title="All Partners" showMenu={true}>
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
              renderItem={({item}) => (
                <AllPartnerComp
                  key={item._id.toString()}
                  navigate={'PartnerDetails'}
                  name={item.name}
                  userid={item.userId}
                  noofumser={item.userList.length}
                  profitpercentage={item.profitPercentage}
                  walletbalance={item.walletTwo?.balance}
                  rechargepercentage={item.rechargePercentage}
                  item={item}
                />
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

export default AllPartner;

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
// import {useGetPartnerPartnerListQuery} from '../../helper/Networkcall';
// import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';

// const AllPartner = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const {accesstoken, user} = useSelector(state => state.user);

//   const [filteredData, setFilteredData] = useState([]);

//     const handleSearch = text => {
//     const filtered = data?.userList?.filter(
//       item =>
//         item.name.toLowerCase().includes(text.toLowerCase()) ||
//         item.userId?.toString() === text,
//     );
//     setFilteredData(filtered);
//   };

//   const userid = user.userId;
//   const {isLoading, data, error, refetch} = useGetPartnerPartnerListQuery({
//     accesstoken,
//     userid,
//   });

//   useEffect(() => {
//     if (!isLoading && data) {
//       console.log(data);
//       setFilteredData(data.userList);
//     }
//     if (error) {
//       console.log(error);
//       Toast.show({
//         type: 'error',
//         text1: 'Something went wrong',
//       });
//     }
//   }, [isLoading, data, error]);

//   const isFocused = useIsFocused();

//   useEffect(() => {
//     refetch();
//   }, [isFocused, refetch]);

//   return (
//     <MainBackgroundWithoutScrollview title={'All Partners'}>
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
//               fontFamily: FONT.Montserrat_Regular,
//               fontSize: heightPercentageToDP(2.5),
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
//             data={filteredData}
//             showsVerticalScrollIndicator={false}
//             keyExtractor={item => item._id}
//             renderItem={({item, index}) => (
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('PartnerDetails', {item})}>
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
//                           flex: 1,
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
//                       <View
//                         style={{
//                           flex: 1,
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'flex-start',
//                         }}>
//                         <Text style={styles.titleRegular}>
//                           Profit Percentage
//                         </Text>
//                         <Text style={styles.titleBold}>
//                           {item.profitPercentage}
//                         </Text>
//                       </View>
//                       <View
//                         style={{
//                           flex: 1,
//                           display: 'flex',
//                           justifyContent: 'center',
//                           alignItems: 'flex-start',
//                         }}>
//                         <Text style={styles.titleRegular}>
//                           Total no. of users
//                         </Text>
//                         <View
//                           style={{
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             flexDirection: 'row',
//                             width: '100%',
//                           }}>
//                           <Text style={styles.titleBold} numberOfLines={1}>
//                             {item.userList?.length}
//                           </Text>
//                           <Text
//                             style={[
//                               styles.titleRegular,
//                               {
//                                 color: item.partnerStatus
//                                   ? 'green'
//                                   : COLORS.red,
//                               },
//                             ]}
//                             numberOfLines={1}>
//                             {item.partnerStatus ? 'Active' : 'Inactive'}
//                           </Text>
//                         </View>
//                       </View>
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

// export default AllPartner;

// const styles = StyleSheet.create({
//   textStyle: {
//     fontSize: heightPercentageToDP(4),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
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
//   paymentOption: {
//     backgroundColor: 'pink',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     height: heightPercentageToDP(15),
//     borderRadius: heightPercentageToDP(2),
//     alignItems: 'center',
//     gap: heightPercentageToDP(3),
//     paddingStart: heightPercentageToDP(2),
//     marginTop: heightPercentageToDP(2),
//   },
//   iconContainer: {
//     backgroundColor: COLORS.white_s,
//     padding: heightPercentageToDP(1.5),
//     borderRadius: heightPercentageToDP(1),
//   },
//   icon: {
//     height: 25,
//     width: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   textStyleContent: {
//     fontSize: heightPercentageToDP(3),
//     fontFamily: FONT.Montserrat_Bold,
//     color: COLORS.black,
//   },
//   subtitle: {
//     fontSize: heightPercentageToDP(1.5),
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Regular,
//   },
//   topContainer: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   bottomContainer: {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centerLine: {
//     height: 1,
//     backgroundColor: COLORS.white_s,
//   },
//   titleRegular: {
//     fontSize: heightPercentageToDP(1.5),
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Regular,
//   },
//   titleBold: {
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.black,
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   titleSemiBold: {
//     fontSize: heightPercentageToDP(2),
//     color: COLORS.white_s,
//     fontFamily: FONT.Montserrat_Bold,
//   },
//   acceptBtn: {
//     backgroundColor: COLORS.green,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: heightPercentageToDP(0.5),
//     borderRadius: heightPercentageToDP(2),
//   },
// });

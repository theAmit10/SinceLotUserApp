import {
  FlatList,
  Image,
  ImageBackground,
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
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../../components/background/Background';
import {COLORS, FONT} from '../../../assets/constants';
import GradientTextWhite from '../../components/helpercComponent/GradientTextWhite';
import GradientText from '../../components/helpercComponent/GradientText';
import Loading from '../../components/helpercComponent/Loading';
import MainBackgroundWithoutScrollview from '../../components/background/MainBackgroundWithoutScrollview';
import {useGetProfitDeductionListQuery} from '../../helper/Networkcall';

const AllProfitDecrease = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {accesstoken, user} = useSelector(state => state.user);

  const dummeyAllUsers = [
    {
      userid: '1090',
      name: 'Babu Roa',
      partner: true,
    },
    {
      userid: '1091',
      name: 'Arjuna',
      partner: true,
    },
    {
      userid: '1092',
      name: 'Mark Jone',
      partner: false,
    },
    {
      userid: '1093',
      name: 'Janny Mona',
      partner: true,
    },
    {
      userid: '1094',
      name: 'Lucy cina',
      partner: true,
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  // Example usage:
  // This will return the date and time in 'America/New_York' timezone.
  // This will return the date and time in 'America/New_York' timezone.

  const handleSearch = text => {
    const filtered = data?.profitDeductions?.filter(
      item =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.userId?.toString() === text,
    );
    setFilteredData(filtered);
  };
  const [expandedItems, setExpandedItems] = useState({});
  const {isLoading, data, error} = useGetProfitDeductionListQuery({
    accesstoken,
    userid: user.userId,
  });

  useEffect(() => {
    if (!isLoading && data) {
      console.log(data);
      setFilteredData(data.profitDeductions);
    }
  }, [isLoading, error, data]);

  const toggleItem = id => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <MainBackgroundWithoutScrollview title={'All Profit Decrease'}>
      {}
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
          placeholder="Search for User"
          placeholderTextColor={COLORS.black}
          label="Search"
          onChangeText={handleSearch}
        />
      </View>

      {/** Content Container */}

      <View
        style={{
          flex: 1,
          padding: heightPercentageToDP(1),
        }}>
        <FlatList
          data={filteredData}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <LinearGradient
              colors={[COLORS.time_firstblue, COLORS.time_secondbluw]}
              start={{x: 0, y: 0}} // start from left
              end={{x: 1, y: 0}} // end at right
              style={{
                justifyContent: 'flex-start',
                borderRadius: heightPercentageToDP(1),
                marginTop: heightPercentageToDP(2),
              }}>
              <TouchableOpacity
                style={styles.paymentOption}
                onPress={() => toggleItem(index)}>
                <View
                  style={{
                    flex: 1,
                    height: '100%',
                  }}>
                  <View style={styles.topContainer}>
                    <View
                      style={{
                        flex: 0.5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.titleRegular}>User ID</Text>
                      <Text style={styles.titleBold}>{item.userId}</Text>
                    </View>
                    <View
                      style={{
                        flex: 1.5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.titleRegular}>Name</Text>
                      <Text style={styles.titleBold} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.titleRegular}>Status</Text>
                      <Text style={styles.titleBold} numberOfLines={1}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedItems[index] && (
                <View
                  style={{
                    padding: heightPercentageToDP(2),
                  }}>
                  <View style={styles.centerLine}></View>
                  <View style={styles.bottomContainer}>
                    <View
                      style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                      }}>
                      <Text style={styles.titleRegular}>Reason</Text>
                      <Text style={styles.titleBold}>{item.reason}</Text>
                    </View>
                  </View>
                </View>
              )}
            </LinearGradient>
          )}
        />
      </View>
    </MainBackgroundWithoutScrollview>
  );
};

export default AllProfitDecrease;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: heightPercentageToDP(8),
    borderRadius: heightPercentageToDP(2),
    alignItems: 'center',
    gap: heightPercentageToDP(3),
    paddingStart: heightPercentageToDP(2),
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
    marginTop: heightPercentageToDP(-1),
    marginBottom: heightPercentageToDP(1),
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

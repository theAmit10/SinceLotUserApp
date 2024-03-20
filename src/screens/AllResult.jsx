import {
    FlatList,
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
  import { useDispatch, useSelector } from 'react-redux';
  import { getAllLocations } from '../redux/actions/locationAction';
  
  const AllResult = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
  
    const {accesstoken} = useSelector(state => state.user);
    const {loading,locations} = useSelector(state => state.location);
  
  
    // const [filteredData, setFilteredData] = useState(locations);
    const [filteredData, setFilteredData] = useState([]);
    
    const handleSearch = text => {
      const filtered = locations.filter(item =>
        item.lotlocation.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    };
  
    const focused = useIsFocused()
  
  
  
    useEffect(() => {
      dispatch(getAllLocations(accesstoken))
    },[dispatch,focused])
  
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
      <View style={{flex: 1}}>
        <Background />

        <View
        style={{
          margin: heightPercentageToDP(2),
          backgroundColor: 'transparent',
        }}>
        <GradientText style={styles.textStyle}>All</GradientText>
        <GradientText style={styles.textStyle}>Result</GradientText>
      </View>
  
        {/** Main Cointainer */}
  
        <View
          style={{
            height: heightPercentageToDP(70),
            width: widthPercentageToDP(100),
            backgroundColor: COLORS.white_s,
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
              height: heightPercentageToDP(10),
              margin: heightPercentageToDP(2),
            }}>
       
            <View
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
              <TextInput
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                  fontSize: heightPercentageToDP(2)
                }}
                placeholder="Search for location"
                label="Search"
                onChangeText={handleSearch}
              />
            </View>
          </View>
  
          <View
            style={{
              flex: 2,
            }}>
              {
                  loading ? (<Loading/>) : (
                  <FlatList
                      data={filteredData}
                      renderItem={({item, index}) => (
                        <TouchableOpacity
                      
                        
                        onPress={() => navigation.navigate("SearchTime",{
                          locationdata: item,
                        })}
                          style={{
                            ...styles.item,
                            backgroundColor:
                              index % 2 === 0 ? COLORS.lightDarkGray : COLORS.grayHalfBg,
                          }}>
                          <Text
                            style={{
                              color: COLORS.black,
                              fontFamily: FONT.HELVETICA_BOLD,
                              fontSize: heightPercentageToDP(2),
                            }}>
                            {item.lotlocation}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item._id}
                      initialNumToRender={10} // Render initial 10 items
                      maxToRenderPerBatch={10} // Batch size to render
                      windowSize={10} // Number of items kept in memory
                    />)
              }
            
          </View>
  
          {/** Bottom Submit Container */}
  
         
  
          
  
          {/** end */}
        </View>
      </View>
    );
  };
  
  export default AllResult;
  
  const styles = StyleSheet.create({
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
  
  
  
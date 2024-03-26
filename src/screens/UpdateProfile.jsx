import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import ProfileBackground from '../components/background/ProfileBackground';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useDispatch, useSelector} from 'react-redux';
import {loadProfile, updateProfile} from '../redux/actions/userAction';
import Loading from '../components/helpercComponent/Loading';
import axios from 'axios';
import UrlHelper from '../helper/UrlHelper';

const UpdateProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const [showProgressBar,setProgressBar] = useState(false);

  const {user, accesstoken, loading, message} = useSelector(
    state => state.user,
  );

  // let loading = false;

  // const updateProfileHandler = () => {
  //   if (!name) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Enter Your Name',
  //     });
  //   } else {
  //     Toast.show({
  //       type: 'info',
  //       text1: 'Updating Profile',
  //     });


  //     setLoading(useUserProfileUpdate(name, navigation, dispatch, 'Profile'))

  //     // dispatch(updateProfile(name, accesstoken));
  //   }
  // };

  // for uploading Profile content
 
  const updateProfileHandler  = async () => {
    if (!name) {
     Toast.show({
       type: 'error',
       text1: 'Enter your name',
     });
     
   } else {
     setProgressBar(true);

     try {
     
       // Resize the image
      //  try {
      //    console.log('Started Compressing Image');
      //    const resizedImage = await ImageResizer.createResizedImage(
      //      imageSource.uri,
      //      200, // Adjust the dimensions as needed
      //      200, // Adjust the dimensions as needed
      //      'JPEG',
      //      100, // Image quality (0-100)
      //      0, // Rotation (0 = no rotation)
      //      null,
      //    );

      //    console.log('Compressed Image :: ' + resizedImage.size);
      //    setImageSource(resizedImage);

      //    if (imageSource) {
      //      formData.append('photo', {
      //        uri: resizedImage.uri,
      //        type: 'image/jpeg',
      //        name: 'profile.jpg',
      //      });
      //    }
      //  } catch (error) {
      //    Toast.show({
      //      type: 'error',
      //      text1: 'Error resizing the image',
      //      text2: error,
      //    });
      //    // console.error('Error resizing the image:', error);
      //  }

       const {data} = await axios.put(
        UrlHelper.UPDATE_USER_PROFILE_API,
        {
          name: name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accesstoken}`,
          },
        },
      );

      console.log("datat :: "+data)

      dispatch(loadProfile(accesstoken))
      
       Toast.show({
         type: 'success',
         text1: data.message,
       });
       setProgressBar(false);
       navigation.goBack();
     } catch (error) {
       Toast.show({
         type: 'error',
         text1: 'Something went wrong',
       });
       console.log(error);

     }
   }
 };

  return (
    <View style={{flex: 1}}>
      <ProfileBackground />

      {/** Profile Cointainer */}

      <View
        style={{
          backgroundColor: COLORS.white_s,
          margin: heightPercentageToDP(2),
          borderRadius: heightPercentageToDP(1),
          paddingStart: heightPercentageToDP(1),
        }}>
        <GradientText
          style={{
            fontSize: heightPercentageToDP(3.5),
            fontFamily: FONT.Montserrat_Bold,
          }}>
          Update
        </GradientText>

        <GradientText
          style={{
            fontSize: heightPercentageToDP(3.5),
            fontFamily: FONT.Montserrat_Bold,
          }}>
          Profile
        </GradientText>
      </View>

      <View
        style={{
          height: heightPercentageToDP(40),
          width: widthPercentageToDP(100),
          backgroundColor: COLORS.white_s,
          borderTopLeftRadius: heightPercentageToDP(5),
          borderTopRightRadius: heightPercentageToDP(5),
          elevation: heightPercentageToDP(3),
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

        {/** Profile Main Container */}
        <View
          style={{
            flex: 2,
            margin: heightPercentageToDP(2),
          }}>
          <View
            style={{
              paddingVertical: heightPercentageToDP(2),
              gap: heightPercentageToDP(2),
            }}>
            {/** Change name container */}

            <View
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <MaterialCommunityIcons
                name={'account'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
              <TextInput
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                }}
                placeholder="Name"
                label="Name"
                value={name}
                onChangeText={text => setName(text)}
              />
            </View>

            {/** Update Profile container */}
            <TouchableOpacity
              onPress={updateProfileHandler}
              style={{
                height: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.grayBg,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <MaterialCommunityIcons
                name={'account'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
              <Text
                style={{
                  marginStart: heightPercentageToDP(1),
                  flex: 1,
                  fontFamily: FONT.SF_PRO_REGULAR,
                }}>
                Profile Picture
              </Text>

              <Ionicons
                name={'chevron-forward-outline'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
            </TouchableOpacity>

            {/** Bottom Submit Container */}

            <View
              style={{
                marginBottom: heightPercentageToDP(5),
                marginTop: heightPercentageToDP(2),
              }}>
              {showProgressBar ? (
                <Loading />
              ) : (
                <TouchableOpacity
                  onPress={updateProfileHandler}
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
                    Submit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
  },
  textStyleEmail: {
    fontSize: heightPercentageToDP(2),
    fontFamily: FONT.Montserrat_Bold,
  },
});

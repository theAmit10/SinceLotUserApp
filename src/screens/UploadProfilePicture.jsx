import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../assets/constants';
import GradientText from '../components/helpercComponent/GradientText';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Background from '../components/background/Background';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {createLocation} from '../redux/actions/locationAction';
import Loading from '../components/helpercComponent/Loading';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import UrlHelper from '../helper/UrlHelper';
import axios from 'axios';
import mime, {Mime} from 'mime';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import GradientTextWhite from '../components/helpercComponent/GradientTextWhite';

const UploadProfilePicture = () => {
  const [enterData, setEnterData] = useState('');
  const {accesstoken} = useSelector(state => state.user);
  const {loading, location} = useSelector(state => state.location);
  const [titleValue, setTitle] = useState('');
  const [discriptionValue, setDescription] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [showProgressBar, setProgressBar] = useState(false);
  const [imageSource, setImageSource] = useState(
    require('../../assets/image/dark_user.png'),
  );

  const checkAndRequestPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);

    if (result === RESULTS.DENIED) {
      if (Platform.OS === 'android' && Platform.Version <= 29) {
        // Target Android 10 and above
        const permissionResult = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (permissionResult !== RESULTS.GRANTED) {
          console.log('Permission not granted!');
          Toast.show({
            type: 'info',
            text1: 'Permission not granted!',
          });
          return;
        }
      }
    }
    // Call your DocumentPicker.pick() function here
    selectDoc();
  };

  // For Opening PhoneStorage
  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      // const doc = await DocumentPicker.pickSingle()
      // const doc = await DocumentPicker.pickMultiple({
      //   type: [ DocumentPicker.types.images]
      // })

      if (doc) {
        console.log(doc);
        console.log(doc[0].uri);
        const ty = mime.getType(doc[0].uri);

        console.log('Image type :: ' + ty);
        console.log('Image type :: ' + doc[0].type);

        setImageSource({uri: doc[0].uri});
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log('User cancelled the upload', err);
      else console.log(err);
    }
  };

  // for uploading Profile content
  const handleUpdateProfile = async () => {
    if (!imageSource) {
      Toast.show({
        type: 'error',
        text1: 'Add profile picture',
      });
    } else {
      setProgressBar(true);

      try {
        const formData = new FormData();
        console.log('Image URI :: ' + imageSource.uri);

        if (!imageSource.uri) {
          Toast.show({
            type: 'error',
            text1: 'Please select a image',
          });
        } else {
          // Resize the image
          try {
            console.log('Started Compressing Image');
            const resizedImage = await ImageResizer.createResizedImage(
              imageSource.uri,
              200, // Adjust the dimensions as needed
              200, // Adjust the dimensions as needed
              'JPEG',
              80, // Image quality (0-100)
              0, // Rotation (0 = no rotation)
              null,
            );

            console.log('Compressed Image :: ' + resizedImage.size);
            setImageSource(resizedImage);

            if (imageSource) {
              formData.append('file', {
                uri: resizedImage.uri,
                type: mime.getType(resizedImage.uri),
                name: 'profile.jpg',
              });
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Error resizing the image',
              text2: error,
            });
            // console.error('Error resizing the image:', error);
          }

          const response = await axios.post(
            UrlHelper.USER_PROFILE_PIC_API,
            formData,
            {
              headers: {
                Authorization: `Bearer ${accesstoken}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );

          console.log('Profile updated successfully:', response.data);
          // console.warn('Profile updated successfully:');
          Toast.show({
            type: 'error',
            text1: 'Profile updated successfully',
          });
          setProgressBar(false);
          navigation.goBack();
        }

        setProgressBar(false);
      } catch (error) {
        setProgressBar(false);
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
      <Background />

      

      {/** Login Cointainer */}

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

        <View
        style={{
          margin: heightPercentageToDP(2),
      
        }}>
        <GradientTextWhite style={styles.textStyle}>Upload</GradientTextWhite>
        <GradientTextWhite style={styles.textStyle}>Profile Picture</GradientTextWhite>
      </View>

        {/** Result Main Container */}

        <View style={{padding: heightPercentageToDP(2)}}>
          <GradientText
            style={{
              fontFamily: FONT.Montserrat_Regular,
              fontSize: heightPercentageToDP(2.5),
              color: COLORS.black,
              marginBottom: heightPercentageToDP(1),
            }}>
            Choose Image
          </GradientText>

          {/** Title container */}

          {/** Top View Rectangle View */}
          <View
            style={{
              width: heightPercentageToDP(30),
              height: heightPercentageToDP(30),
              backgroundColor: COLORS.grayHalfBg,
              position: 'absolute',
              borderRadius: heightPercentageToDP(5),
              zIndex: 1,
              top: heightPercentageToDP(10),
              left: widthPercentageToDP(20),
              elevation: heightPercentageToDP(1),
            }}>
            {/** User Profile Image */}
            <TouchableOpacity
              onPress={checkAndRequestPermission}
              style={{
                borderRadius: 100,
                overflow: 'hidden',
                width: heightPercentageToDP(20),
                height: heightPercentageToDP(20),
                zIndex: 2,
                position: 'absolute',
                top: heightPercentageToDP(-2),
                left: heightPercentageToDP(4),
              }}>
              <Image
                // source={{ uri: 'https://imgs.search.brave.com/bNjuaYsTPw2b4yerAkKyk82fwZ9sNFwkwb3JMnX7qBg/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NDU5OTYxMjQtMDUw/MWViYWU4NGQwP3E9/ODAmdz0xMDAwJmF1/dG89Zm9ybWF0JmZp/dD1jcm9wJml4bGli/PXJiLTQuMC4zJml4/aWQ9TTN3eE1qQTNm/REI4TUh4elpXRnlZ/Mmg4TWpCOGZHWmhZ/MlY4Wlc1OE1IeDhN/SHg4ZkRBPQ.jpeg' }}
                source={imageSource}
                resizeMode="cover"
                style={{
                  height: heightPercentageToDP(20),
                  width: heightPercentageToDP(20),
                }}
              />
            </TouchableOpacity>

            {/** Username */}

            {/** Email */}

            <View
              style={{
                width: heightPercentageToDP(15),
                height: heightPercentageToDP(30),
                backgroundColor: COLORS.grayHalfBg,
                position: 'absolute',
                zIndex: 1,
                borderTopLeftRadius: heightPercentageToDP(5),
                borderBottomLeftRadius: heightPercentageToDP(5),
              }}></View>
          </View>
        </View>

        {showProgressBar ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}>
            <Loading />
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'flex-end',
              flex: 1,
              alignItems: 'flex-end',
              paddingVertical: heightPercentageToDP(4),
              paddingHorizontal: heightPercentageToDP(2),
            }}>
            <TouchableOpacity
              onPress={handleUpdateProfile}
              className="rounded-full"
              style={{
                height: heightPercentageToDP(7),
                width: heightPercentageToDP(7),
                flexDirection: 'row',
                backgroundColor: COLORS.blue,
                alignItems: 'center',
                paddingHorizontal: heightPercentageToDP(2),
                borderRadius: heightPercentageToDP(1),
              }}>
              <Ionicons
                name={'send'}
                size={heightPercentageToDP(3)}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
            </ImageBackground>
            </View>

   
    </View>
  );
};

export default UploadProfilePicture;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: heightPercentageToDP(4),
    fontFamily: FONT.Montserrat_Bold,
    color: COLORS.white_s
  },
});

import React from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {COLORS, FONT} from '../../constants';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../assets/image/dark_user.png'),
    title: 'Welcome to Wallet',
    subtitle: "Manage all your crypto assets! It's Simple and easy! ",
  },
  {
    id: '2',
    image: require('../../assets/image/dark_user.png'),
    title: 'Receive and Send Money to frends!',
    subtitle: 'Keep BTC ETC,XRP and many other ERC-20 based tokens',
  },
  {
    id: '3',
    image: require('../../assets/image/dark_user.png'),
    title: 'Your Safety is Our Top Priority',
    subtitle: 'Our top-notch security features will keep you completely safe',
  },
];

const Slide = ({item}) => {
  return (
    <View
      style={{
        width: wp(100),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
        <LinearGradient
          colors={[
            COLORS.gray2,
            COLORS.white,
          ]}
          className="rounded-full p-10">
          <Image
            source={item?.image}
            style={{
              width: hp(10),
              height: hp(10),
              resizeMode: 'center',
            }}
          />
        </LinearGradient>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <LinearGradient
          colors={[
            THEME.data === 'DARK' ? COLORS.purple : COLORS.gray2,
            THEME.data === 'DARK' ? COLORS.purpleDark : COLORS.white,
          ]}
          className="rounded-full p-10"
          style={{
            position: 'absolute',
            top: heightPercentageToDP(10),
            left: widthPercentageToDP(-10),
          }}
        />
        <View>
          <Text
            style={{
              color: THEME.data === 'DARK' ? COLORS.white : COLORS.purpleDark,
              ...styles.title,
            }}>
            {item?.title}
          </Text>
          <Text style={styles.subtitle}>{item?.subtitle}</Text>
        </View>
      </View>
    </View>
  );
};

const OnboardingScreen = ({navigation}) => {
  const THEME = useSelector(state => state.theme);
  // THEME = 'LIGHT';
  console.log('THEME OB : ' + THEME.data);

  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const settingFirstTimeInstall = () => {
    try {
      const jsonValue = JSON.stringify('yes');
      AsyncStorage.setItem('firstTimeAppInstall', jsonValue);
      navigation.replace('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          backgroundColor:
            THEME.data === 'DARK' ? COLORS.purpleDark : COLORS.white,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.green,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
                style={styles.btn}
                onPress={settingFirstTimeInstall}>
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: hp(2),
                    color: COLORS.white,
                  }}>
                  Let's Get Started
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: 'red',
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: hp(2),
                    color:
                      THEME.data === 'DARK' ? COLORS.white : COLORS.purpleDark,
                  }}>
                  Skip
                </Text>
              </TouchableOpacity>

              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontFamily: FONT.bold,
                    fontSize: hp(2),
                    color: COLORS.white,
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          THEME.data === 'DARK' ? COLORS.purpleDark : COLORS.white,
      }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    color: COLORS.gray2,
    marginTop: heightPercentageToDP(2),
    maxWidth: '70%',
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: heightPercentageToDP(2),
  },
  title: {
    fontFamily: FONT.extrabold,
    fontSize: hp(2.5),
    maxWidth: '70%',
    marginTop: 20,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },

  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.green,
  },
});
export default OnboardingScreen;

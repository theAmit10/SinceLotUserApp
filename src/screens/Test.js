

import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Image, Dimensions, ScrollView} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const {width} = Dimensions.get('window');
const images = [
  'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
  'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
  'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
];

const ImageSlider = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % images.length;
      setCurrentPage(nextPage);
      scrollViewRef.current.scrollTo({x: width * nextPage, animated: true});
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPage]);

  const handlePageChange = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / width);
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handlePageChange}
          scrollEventThrottle={16}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{uri: image}}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {backgroundColor: currentPage === index ? 'blue' : 'gray'},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width,
    height: 200, // adjust the height as needed
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: heightPercentageToDP(1)
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default ImageSlider;


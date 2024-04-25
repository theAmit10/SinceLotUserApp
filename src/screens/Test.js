import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ImageSlider} from '@pembajak/react-native-image-slider-banner';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {COLORS} from '../../assets/constants';

const Test = () => {
  return (
    <View>
      <Text>Test</Text>
      <View
        style={{
          margin: heightPercentageToDP(2),
          borderRadius: heightPercentageToDP(2),
          overflow: 'hidden',
      
        }}>
        <ImageSlider
          data={[
            {
              img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU',
            },
            {
              img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg',
            },
            {
              img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg',
            },
          ]}
          autoPlay={true}
          onItemChanged={item => console.log('item', item)}
          closeIconColor="#fff"
          caroselImageStyle={{resizeMode: 'cover'}}
          indicatorMainContainerStyle={{
            justifyContent: 'flex-end',
          }}
          caroselImageContainerStyle={{
            height: heightPercentageToDP(20),
          }}
          indicatorContainerStyle={{
            position: 'absolute',
            bottom: 0,
          }}
          activeIndicatorStyle={{
            backgroundColor: COLORS.blue,
          }}
          inActiveIndicatorStyle={{
            backgroundColor: COLORS.grayHalfBg,
          }}
        />
      </View>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({});


// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {ImageSlider} from '@pembajak/react-native-image-slider-banner';
// import {heightPercentageToDP} from 'react-native-responsive-screen';
// import {COLORS} from '../../assets/constants';

// const images = [
//   'https://imgs.search.brave.com/PvhNVIxs9m8r1whelc9RPX2dMQ371Xcsk3Lf2dCiVHQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYmlnLXNhbGUt/YmFubmVyLWRlc2ln/bi1zcGVjaWFsLW9m/ZmVyLXVwLTUwLW9m/Zi1yZWFkeS1wcm9t/b3Rpb24tdGVtcGxh/dGUtdXNlLXdlYi1w/cmludC1kZXNpZ25f/MTEwNDY0LTU3MC5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw',
//   'https://imgs.search.brave.com/0_WERhkh6NjaGafm4qPeYRM1WbUdabgTpK7LCJ8EKFA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaG90LXNhbGUt/aG9yaXpvbnRhbC1i/YW5uZXItd2l0aC1z/ZWFzb25hbC1vZmZl/cl80MTkzNDEtNjA1/LmpwZz9zaXplPTYy/NiZleHQ9anBn',
//   'https://imgs.search.brave.com/pBRUab3Kras4ziV_cQdR0AtRiSrOuJKwhMTmHY988d8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3Ivc3BlY2lhbC1v/ZmZlci1maW5hbC1z/YWxlLXRhZy1iYW5u/ZXItZGVzaWduLXRl/bXBsYXRlLW1hcmtl/dGluZy1zcGVjaWFs/LW9mZmVyLXByb21v/dGlvbl82ODA1OTgt/MTk1LmpwZz9zaXpl/PTYyNiZleHQ9anBn',
// ];

// const Test = () => {
//   return (
//     <View>
//       <Text>Test</Text>
//       <View
//         style={{
//           margin: heightPercentageToDP(2),
//           borderRadius: heightPercentageToDP(2),
//           overflow: 'hidden'
//         }}>
//         <ImageSlider
//           data={[
//             {
//               img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU',
//             },
//             {
//               img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg',
//             },
//             {
//               img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg',
//             },
//           ]}
//           autoPlay={true}
//           onItemChanged={item => console.log('item', item)}
//           closeIconColor="#fff"
//           caroselImageStyle={{resizeMode: 'contain'}}
//           indicatorMainContainerStyle={{
//             justifyContent: 'flex-end',
//           }}
//           caroselImageContainerStyle={{
//             height: heightPercentageToDP(25),
            
            
//           }}
//           indicatorContainerStyle={{
//             position: 'absolute',
//             bottom: 0,
//           }}
//           activeIndicatorStyle={{
//             backgroundColor: COLORS.blue,
//           }}
//           inActiveIndicatorStyle={{
//             backgroundColor: COLORS.grayHalfBg,
//           }}

          
//         />
//       </View>
//     </View>
//   );
// };

// export default Test;

// const styles = StyleSheet.create({});

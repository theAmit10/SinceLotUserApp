import axios from 'axios';
import {store} from '../store';

import {combineSlices} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UrlHelper from '../../helper/UrlHelper';

export const login = (email, password) => async dispatch => {
  try {
    dispatch({
      type: 'loginRequest',
    });

    console.log('Email :: ' + email);
    console.log('Password :: ' + password);

    // Axios Calling

    const {data} = await axios.post(
      UrlHelper.LOGIN_API,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('Data :: ' + data.token);
    // AsyncStorage.setItem('accessToken', response.data.access_token);
    AsyncStorage.setItem('accesstoken', data.token);
    // dispatch(updateAccessToken(response.data.access_token));

    dispatch({
      type: 'getaccesstoken',
      payload: data.token,
    });
    dispatch({
      type: 'loginSuccess',
      payload: data.message,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response);

    dispatch({
      type: 'loginFail',
      payload: error.response.data.message,
    });
  }
};

// Gettting Profile
export const loadProfile = accesstoken => async dispatch => {
  console.log('Loading Profile');

  try {
    dispatch({
      type: 'loadUserRequest',
    });

    const {data} = await axios.get(UrlHelper.USER_PROFILE_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    console.log('Data :: ' + data.user);

    dispatch({
      type: 'loadUserSuccess',
      payload: data.user,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response);

    dispatch({
      type: 'loadUserFail',
      payload: error.response.data.message,
    });
  }
};

// logging off
export const logout = accesstoken => async dispatch => {
  console.log('Processing logout');

  try {
    dispatch({
      type: 'logoutRequest',
    });

    const {data} = await axios.get(UrlHelper.LOGOUT_API, {
      headers: {
        // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWVmMzk2YTA1ODRlYTZkZDhkNjE0ZjQiLCJpYXQiOjE3MTAxNzcyNzN9.k-dMQaWbwdx7oFweRKy2xl9aFCISpm168qdzEUwXPow`,
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    dispatch({
      type: 'logoutSuccess',
      payload: data.message,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'loadUserFail',
      payload: error.response.data.message,
    });
  }
};


// Getting Registered
export const register = (name,email,password) => async dispatch => {
  console.log("Registering User")
  try {
    dispatch({
      type: 'registerRequest',
    });
    const {data} = await axios.post(
      UrlHelper.REGISTER_API,
      {
          name,
          email,
          password,
          role: 'admin'
      }
  ,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    AsyncStorage.setItem("accesstoken",data.token)
    dispatch({
      type: 'getaccesstoken',
      payload: data.token,
    });

    console.log("register data :: "+JSON.stringify(data))

    dispatch({
      type: 'registerSuccess',
      payload: data.message,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response.data.message);

    dispatch({
      type: 'registerFail',
      payload: error.response.data.message,
    });
  }
};

// // Getting Registered
// export const register = (name, email, password) => async dispatch => {
//   console.log('Registering User');
//   try {
//     dispatch({
//       type: 'registerRequest',
//     });
//     const {data} = await axios.post(
//       UrlHelper.REGISTER_API,
//       {
//         name,
//         email,
//         password,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     console.log('register data :: ' + data);

//     dispatch({
//       type: 'registerSuccess',
//       payload: data.message,
//     });
//   } catch (error) {
//     console.log(error);
//     console.log(error.response.data.message);

//     dispatch({
//       type: 'registerFail',
//       payload: error.response.data.message,
//     });
//   }
// };

// Getting Accesstoken
export const getUserAccessToken = token => async dispatch => {
  console.log('Getting Access Token');

  try {
    dispatch({
      type: 'getaccesstoken',
      payload: token,
    });
  } catch (error) {
    console.log(error);
  }
};

// For Updating User Profile

export const updateProfile = (name, accesstoken) => async dispatch => {
  try {
    console.log("Updated profile started :: "+name)
    dispatch({
      type: 'updateProfileRequest',
    });
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

    console.log("Updated Prifile :: "+data.message)

    dispatch({
      type: 'updateProfileSuccess',
      payload: data.message,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: 'updateProfileFail',
      payload: error.response.data.message,
    });
  }
};

// Load All PROMOTION
export const loadAllPromotion = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllPromotionRequest',
  });
  
    const {data} = await axios.get(UrlHelper.ALL_PROMOTIONS_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });
  
    dispatch({
      type: 'getAllPromotionSuccess',
      payload: data.promotions,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response);
  
    dispatch({
      type: 'getAllPromotionFail',
      payload: error.response.data.message,
    });
  }
  };



  // Load All About Us
export const loadAllAboutUs = (accesstoken) => async dispatch => {
  try {
    dispatch({
      type: 'getAllAboutRequest',
  });
  
    const {data} = await axios.get(UrlHelper.ALL_ABOUT_API, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });
  
    dispatch({
      type: 'getAllAboutSuccess',
      payload: data.aboutus,
    });
  } catch (error) {
    console.log(error);
    console.log(error.response);
  
    dispatch({
      type: 'getAllAboutFail',
      payload: error.response.data.message,
    });
  }
  };
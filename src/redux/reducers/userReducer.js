import {createReducer} from '@reduxjs/toolkit';

// Below Reducer can login, Register, get Profile, logout

export const userReducer = createReducer(
  {
    loading: false,
    promotions: [],
    loadingAbout: false,
    loadingNotification: false,
  },
  builder => {
    builder
      .addCase('loginRequest', state => {
        state.loading = true;
      })
      .addCase('loadUserRequest', state => {
        state.loading = true;
      })
      .addCase('logoutRequest', state => {
        state.loading = true;
      })
      .addCase('registerRequest', state => {
        state.loading = true;
      })
      .addCase('updateProfileRequest', state => {
        state.loading = true;
      })
      .addCase('getAllAboutRequest', state => {
        state.loadingAbout = true;
      })
      .addCase('getAllPromotionRequest', state => {
        state.loadingPromotion = true;
      })
      .addCase('getAllNotificationRequest', state => {
        state.loadingNotification = true;
      });

    builder
      .addCase('loginSuccess', (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase('loadUserSuccess', (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase('logoutSuccess', (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase('registerSuccess', (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase('updateProfileSuccess', (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase('getAllAboutSuccess', (state, action) => {
        state.loadingAbout = false;
        state.abouts = action.payload;
      })
      .addCase('getAllPromotionSuccess', (state, action) => {
        state.loadingPromotion = false;
        state.promotions = action.payload;
      })
      .addCase('getAllNotificationSuccess', (state, action) => {
        state.loadingNotification = false;
        state.notifications = action.payload;
      });

    builder
      .addCase('loginFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('loadUserFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('logoutFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('updateProfileFail', (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('getAllAboutFail', (state, action) => {
        state.loadingAbout = false;
        state.error = action.payload;
      })
      .addCase('getAllPromotionFail', (state, action) => {
        state.loadingPromotion = false;
        state.error = action.payload;
      })
      .addCase('getAllNotificationFail', (state, action) => {
        state.loadingNotification = false;
        state.error = action.payload;
      });

    builder.addCase('registerFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase('getaccesstoken', (state, action) => {
      state.accesstoken = action.payload;
    });
    builder.addCase('clearError', state => {
      state.error = null;
    });
    builder.addCase('clearMessage', state => {
      state.message = null;
    });
    builder.addCase('clearAllPromotion', state => {
        state.promotions = [];
      });
    builder.addCase('clearAllAbout', state => {
      state.abouts = [];
    });
    builder.addCase('clearAllNotication', state => {
      state.notifications = [];
    });
  },
);

import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './reducers/userReducer';
import userAccessTokenSlice from './userAccessTokenSlice';
import {locationReducer} from './reducers/locationReducer';
import {timeReducer} from './reducers/timeReducer';
import {dateReducer} from './reducers/dateReducer';
import {resultReducer} from './reducers/resultReducer';
import {promotionReducer} from './reducers/promotionReducer';
import userDeviceTokenSlice from './userDeviceTokenSlice';
import {sincelotUserApi} from '../helper/Networkcall';
import {setupListeners} from '@reduxjs/toolkit/query';
import ticketSlice from './ticketSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    userAccessToken: userAccessTokenSlice,
    tickets: ticketSlice,
    location: locationReducer,
    time: timeReducer,
    date: dateReducer,
    result: resultReducer,
    promotion: promotionReducer,
    userDeviceToken: userDeviceTokenSlice,
    [sincelotUserApi.reducerPath]: sincelotUserApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sincelotUserApi.middleware),
});

setupListeners(store.dispatch);

// export const server = "https://jenny.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru/api/v1/"
// export const serverName = "https://jenny.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru"

// export const server = "https://adminbackend-apsw.onrender.com/api/v1/"
// export const serverName = "https://adminbackend-apsw.onrender.com"

export const server =
  'https://dev.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru/api/v1/';
export const serverName =
  'https://dev.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru';

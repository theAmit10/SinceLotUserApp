import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import UrlHelper from './UrlHelper';
import { server } from '../redux/store';

export const sincelotUserApi = createApi({
  reducerPath: 'sincelotUserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jenny.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru/api/v1/',
  }),
  endpoints: builder => ({
    getData: builder.query({
      query: accessToken => ({
        url: 'user/profile',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    // FOR CREATE A WITHDRAW REQUEST
    createWithdraw: builder.mutation({
      query: ({accessToken, body}) => ({
        url: UrlHelper.WITHDRAW_PAYMENT_API,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // FOR GETTING ALL THE LOCATION WITH TIME
    getAllLocationWithTime: builder.query({
      query: accessToken => ({
        url: 'result/alllotlocationwithtime',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    // FOR BETTING

     // FOR GETTING DATE ACCORDING TO THE LOCATION, TIME
    //  getDateAccToLocTime: builder.query({
    //     query: (accessToken, lottimeId,lotlocationId) => ({
    //       url: `result/searchdate?lottimeId=${lottimeId}&lotlocationId=${lotlocationId}`,
    //       method: 'get',
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }),
    //   }),
    getDateAccToLocTime: builder.query({
      query: ({ accessToken, lottimeId, lotlocationId }) => ({
        url: `result/searchdate?lottimeId=${lottimeId}&lotlocationId=${lotlocationId}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),
    

    // FOR GETTING BET ACCORDING TO THE LOCATION, TIME AND CURRENT DATE
    getBetAccToLocTimeDate: builder.query({
      query: (accessToken, lotlocation, lottime, lotdate) => ({
        url: `result/playzone/singleplay?lotlocation=${lotlocation}&lottime=${lottime}&lotdate=${lotdate}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

     // FOR CREATE A PLAY REQUEST
     createPlay: builder.mutation({
      query: ({accessToken, body}) => ({
        url: UrlHelper.CREATE_PLAY_API,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),


    // FOR HISTORIES

     // FOR GETTING USERS PLAY HISTORY
     getPlayHistory: builder.query({
      query: accessToken => ({
        url: 'result/singleuser/playbets',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

     // FOR GETTING USERS HISTORY
     getHistory: builder.query({
      query: ({accesstoken,userId}) => ({
        url: "user/getuserdeposit/?userid="+userId,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A DEPOSIT REQUEST
    createDeposit: builder.mutation({
      query: ({accessToken, body}) => ({
        url: UrlHelper.DEPOSIT_API,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        body,
      }),
    }),

    // FOR GETTING ALL COUNTRY LIST
    getAllCountry: builder.query({
      query: (accesstoken) => ({
        url: `result/allcurrencies`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A BALANCE TRANSFER REQUEST
    transferWalletBalance: builder.mutation({
      query: ({accessToken, body}) => ({
        url: UrlHelper.BALANCE_TRANSFER_TO_WALLET_TWO_API,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

   

    // For CHECKING ALL NOTFICATION SEEN
     checkNotificationSeen: builder.mutation({
      query: ({accessToken, id}) => ({
        url: `${UrlHelper.NOTIFICATION_SEEN_API}${id}/notifications/seen`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),



    // ######## END #########
  }),
});

export const {
  useGetDataQuery,
  useCreateWithdrawMutation,
  useGetAllLocationWithTimeQuery,
  useGetDateAccToLocTimeQuery,
  useGetBetAccToLocTimeDateQuery,
  useCreatePlayMutation,
  useGetPlayHistoryQuery,
  useGetHistoryQuery,
  useCreateDepositMutation,
  useGetAllCountryQuery,
  useTransferWalletBalanceMutation,
  useCheckNotificationSeenMutation,
} = sincelotUserApi;

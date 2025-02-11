import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import UrlHelper from './UrlHelper';
import {server} from '../redux/store';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

// baseUrl: 'https://jenny.worldgames55fhgfg7sd8fvgsd8f6gs8dfgdsfgds6onion.ru/api/v1/',

export const sincelotUserApi = createApi({
  reducerPath: 'sincelotUserApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://adminbackend-apsw.onrender.com/api/v1/',
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
      query: ({accessToken, lottimeId, lotlocationId}) => ({
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
      query: ({accesstoken, userId}) => ({
        url: 'user/getuserdeposit/?userid=' + userId,
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
          'Content-Type': 'multipart/form-data',
        },
        body,
      }),
    }),

    // FOR GETTING ALL COUNTRY LIST
    getAllCountry: builder.query({
      query: accesstoken => ({
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

    // GET ALL THE RESULT
    getResultLocMonYear: builder.query({
      query: ({accessToken, locationid, year, month}) => ({
        url: `result/allresultlocmonyear?locationid=${locationid}&year=${year}&month=${month}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    // FOR DELETE A UPI ACCOUNT
    deleteUpiAccount: builder.mutation({
      query: ({accesstoken, id}) => ({
        url: `result/removeupipayment/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A UPI ACCOUNT
    createUPIAccount: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'result/addupipayment',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'multipart/form-data',
        },
        body,
      }),
    }),

    // FOR CREATE A BANK ACCOUNT
    createBankAccount: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'result/addbankpayment',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // FOR DELETE A BANK ACCOUNT
    deleteBankAccount: builder.mutation({
      query: ({accesstoken, id}) => ({
        url: `result/removebankpayment/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A PAYPAL ACCOUNT
    createPaypalAccount: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'result/addpaypalpayment',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // FOR DELETE A PAYPAL ACCOUNT
    deletePaypalAccount: builder.mutation({
      query: ({accesstoken, id}) => ({
        url: `result/removepaypalpayment/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A SKRILL ACCOUNT
    createSkrillAccount: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'result/addskrillpayment',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // FOR DELETE A SKRILL ACCOUNT
    deleteSkrillAccount: builder.mutation({
      query: ({accesstoken, id}) => ({
        url: `result/removeskrillpayment/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // FOR CREATE A CRYPTO ACCOUNT
    createCryptoAccount: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'result/addcryptopayment',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'multipart/form-data',
        },
        body,
      }),
    }),

    // FOR DELETE A CRYPTO ACCOUNT
    deleteCryptoAccount: builder.mutation({
      query: ({accesstoken, id}) => ({
        url: `result/removecryptopayment/${id}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // Partner Module

    // GET POWERBALL GAME DETAILS
    getPowerball: builder.query({
      query: ({accesstoken, id}) => ({
        url: `user/getpowerball/${id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // GET ALL POWER TIMES
    getPowetTimes: builder.query({
      query: ({accesstoken}) => ({
        url: 'user/getallpowertime',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // GET POWER DATES
    getPowerDates: builder.query({
      query: ({accessToken, id}) => ({
        url: `user/getpowerdate/${id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    }),

    // GET ABOUT PARTNER
    getAboutPartner: builder.query({
      query: ({accesstoken, userid}) => ({
        url: `user/getpartnerbyuserid/${userid}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // GET PARTNER PARTNERLIST
    getPartnerPartnerList: builder.query({
      query: ({accesstoken, userid}) => ({
        url: `user/getpartnerpartnerlist/${userid}`,
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          method: 'get',
        },
      }),
    }),

    // GET PARTNER USERLIST
    getPartnerUserList: builder.query({
      query: ({accesstoken, userId}) => ({
        url: `user/getpartneruserlist/${userId}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // GET PARTNER PROFIT DEDUCTION LIST
    getPartnerProfitDeduction: builder.query({
      query: ({accesstoken, userid}) => ({
        url: `user/getprofitdeduction/${userid}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // Create sub partner
    createSubPartner: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'user/createsubpartner',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // Remove user from userlist
    removeUserFromUserList: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'user/removeuserfromuserlist',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // INCREASE PROFIT PERCENTAGE

    updateProfitPercentage: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'user/increaseprofit',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // PROFIT PROFIT DECREASE
    decreasePartnerProfit: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: 'user/createprofitdeduction',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),

    // PROFIT DEDUCTION LIST
    getProfitDeductionList: builder.query({
      query: ({accesstoken, userid}) => ({
        url: `user/getprofitdeduction/${userid}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),

    getRechargeModule: builder.query({
      query: ({accesstoken, id}) => ({
        url: `user/getrechargebyid/${id}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),

    getAllRecharge: builder.query({
      query: ({accesstoken, userId}) => ({
        url: `user/getsinglepartnerrecharge/${userId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        },
      }),
    }),

    // FOR GETTING USERS SINGLE USER PLAY HISTORY
    getSingleUserPlayHistory: builder.query({
      query: ({accesstoken, userId}) => ({
        url: 'result/singleuserplayhistory/' + userId,
        method: 'get',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
        },
      }),
    }),

    // [UPDATE RECHARGE STATUS]
    updateDepositPaymentStatus: builder.mutation({
      query: ({accesstoken, body}) => ({
        url: `user/updateuserdeposit`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'multipart/form-data',
        },
        body,
      }),
    }),

    // ######## END #########
  }),
});
export const {
  useUpdateDepositPaymentStatusMutation,
  useGetSingleUserPlayHistoryQuery,
  useGetAllRechargeQuery,
  useGetRechargeModuleQuery,
  useGetProfitDeductionListQuery,
  useDecreasePartnerProfitMutation,
  useUpdateProfitPercentageMutation,
  useRemoveUserFromUserListMutation,
  useCreateSubPartnerMutation,
  useGetPartnerProfitDeductionQuery,
  useGetPartnerPartnerListQuery,
  useGetPartnerUserListQuery,
  useGetAboutPartnerQuery,
  useGetPowerDatesQuery,
  useGetPowetTimesQuery,
  useGetPowerballQuery,
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
  useGetResultLocMonYearQuery,
  useDeleteUpiAccountMutation,
  useCreateUPIAccountMutation,
  useCreateBankAccountMutation,
  useDeleteBankAccountMutation,
  useCreatePaypalAccountMutation,
  useDeletePaypalAccountMutation,
  useCreateSkrillAccountMutation,
  useDeleteSkrillAccountMutation,
  useCreateCryptoAccountMutation,

  useDeleteCryptoAccountMutation,
} = sincelotUserApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import UrlHelper from './UrlHelper';

export const sincelotUserApi = createApi({
  reducerPath: 'sincelotUserApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://adminbackend-lyyx.onrender.com/api/v1/' }),
  endpoints: (builder) => ({
    getData: builder.query({
      query: (accessToken) => ({
        url: 'user/profile',
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }),
    createWithdraw: builder.mutation({
      query: ({ accessToken, body }) => ({
        url: UrlHelper.WITHDRAW_PAYMENT_API,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body,
      }),
    }),
  }),
});

export const { useGetDataQuery, useCreateWithdrawMutation } = sincelotUserApi;


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import UrlHelper from './UrlHelper';

// export const sincelotUserApi = createApi({
//     reducerPath: 'sincelotUserApi',
//     baseQuery: fetchBaseQuery({ baseUrl: 'https://adminbackend-lyyx.onrender.com/api/v1/' }),
//     endpoints: (builder) => ({
//       getData: builder.query({
//         query: (accesstoken) => ({
//           url: 'user/profile',
//           method: 'get',
//           headers: {
//             Authorization: `Bearer ${accesstoken}`,
//           },
//         })
//       }),

//      // Define a POST request
//      createWithdraw: builder.mutation({
//         query: ({ accessToken, body }) => ({
//           url: UrlHelper.WITHDRAW_PAYMENT_API,
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//           body,
//         }),
//       }),

//     }),
//   });

//  export const { useGetDataQuery, useCreateWithdrawMutation } = sincelotUserApi;



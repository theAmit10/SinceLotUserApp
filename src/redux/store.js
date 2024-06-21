import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./reducers/userReducer"
import userAccessTokenSlice from "./userAccessTokenSlice"
import { locationReducer } from "./reducers/locationReducer"
import { timeReducer } from "./reducers/timeReducer"
import { dateReducer } from "./reducers/dateReducer"
import { resultReducer } from "./reducers/resultReducer"
import { promotionReducer } from "./reducers/promotionReducer"
import userDeviceTokenSlice from "./userDeviceTokenSlice"

export const store = configureStore({
    reducer:{
        user: userReducer,
        userAccessToken: userAccessTokenSlice,
        location: locationReducer,
        time: timeReducer,
        date: dateReducer,
        result: resultReducer,
        promotion: promotionReducer,
        userDeviceToken: userDeviceTokenSlice,
    }
})

// export const server = "https://sincelott.onrender.com/api/v1/"
// export const serverName = "https://sincelott.onrender.com"

export const server = "https://sinceapp.thelionworld.com/api/v1/"
export const serverName = "https://sinceapp.thelionworld.com"
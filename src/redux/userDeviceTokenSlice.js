import {createSlice} from '@reduxjs/toolkit';

export const userDeviceTokenSlice = createSlice({
  name: 'userDeviceToken',
  initialState: {
    data: '',
  },
  reducers: {
    updateDeviceToken(state, action) {
      state.data = action.payload;
     
    },
  },
});

export const {updateDeviceToken} = userDeviceTokenSlice.actions;
export default userDeviceTokenSlice.reducer;

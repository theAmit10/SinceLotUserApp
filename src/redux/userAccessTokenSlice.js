import {createSlice} from '@reduxjs/toolkit';

export const userAccessTokenSlice = createSlice({
  name: 'userAccessToken',
  initialState: {
    data: '',
  },
  reducers: {
    updateAccessToken(state, action) {
      state.data = action.payload;
     
    },
  },
});

export const {updateAccessToken} = userAccessTokenSlice.actions;
export default userAccessTokenSlice.reducer;

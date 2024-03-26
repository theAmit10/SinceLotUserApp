import { createReducer } from "@reduxjs/toolkit";

// Below Reducer can login, Register, get Profile, logout

export const userReducer = createReducer({
    loading:false
},(builder)=>{
    
    builder.addCase("loginRequest",(state) => {
        state.loading = true;
    })
    .addCase("loadUserRequest",(state) => {
        state.loading = true;
    })
    .addCase("logoutRequest",(state) => {
        state.loading = true;
    })
    .addCase("registerRequest",(state) => {
        state.loading = true;
    })
    .addCase("updateProfileRequest",(state) => {
        state.loading = true;
    });
    builder.addCase("loginSuccess",(state,action) => {
        state.loading = false;
        state.message = action.payload;
    })
    .addCase("loadUserSuccess",(state,action) => {
        state.loading = false;
        state.user = action.payload;
    })
    .addCase("logoutSuccess",(state,action) => {
        state.loading = false;
        state.message = action.payload;
        state.user = null;
    })
    .addCase("registerSuccess",(state,action) => {
        state.loading = false;
        state.message = action.payload;
    })
    .addCase("updateProfileSuccess",(state,action) => {
        state.loading = false;
        state.message = action.payload;
    });
    builder.addCase("loginFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("loadUserFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("logoutFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("updateProfileFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    builder.addCase("registerFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    builder.addCase("getaccesstoken",(state,action) => {
        state.accesstoken = action.payload;
    });
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.message = null
    });

})
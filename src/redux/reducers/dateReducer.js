import { createReducer } from "@reduxjs/toolkit";


export const dateReducer = createReducer({
    loading:false,
    dates: [],
    date: {}
},(builder)=>{
    
    builder.addCase("getAllDateRequest",(state) => {
        state.loading = true;
    })
    .addCase("getDateRequest",(state) => {
        state.loading = true;
    })
    
    builder.addCase("getAllDateSuccess",(state,action) => {
        state.loading = false;
        state.dates = action.payload;
    })
    .addCase("getDateSuccess",(state,action) => {
        state.loading = false;
        state.date = action.payload;
    })
    
    builder.addCase("getAllDateFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("getDateFail",(state,action) => {
        state.loading = false;
        state.error = action.payload;
    })
   
    
    builder.addCase("clearError",(state) => { 
        state.error = null
    });
    builder.addCase("clearMessage",(state) => { 
        state.dates = []
    });

})
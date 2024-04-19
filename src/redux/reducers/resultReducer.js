import {createReducer} from '@reduxjs/toolkit';

export const resultReducer = createReducer(
  {
    loadingResult: false,
    results: [],
    result: {},
    resultAccordingLocation: [],
    loadingForResultAccordingLocation: false,
    loaderForNextResult: false,
    nextResult: [],
  },
  builder => {
    builder
      .addCase('getAllResultRequest', state => {
        state.loadingResult = true;
      })
      .addCase('getResultRequest', state => {
        state.loadingResult = true;
      })
      .addCase('getAllResultAccordingLocationRequest', state => {
        state.loadingForResultAccordingLocation = true;
      })
      .addCase('getNextResultRequest', state => {
        state.loaderForNextResult = true;
      });

    builder
      .addCase('getAllResultSuccess', (state, action) => {
        state.loadingResult = false;
        state.results = action.payload;
      })
      .addCase('getResultSuccess', (state, action) => {
        state.loadingResult = false;
        state.result = action.payload;
      })
      .addCase('getAllResultAccordingLocationSuccess', (state, action) => {
        state.loadingForResultAccordingLocation = false;
        state.resultAccordingLocation = action.payload;
      })
      .addCase('getNextResultSuccess', (state, action) => {
        state.loaderForNextResult = false;
        state.nextResult = action.payload;
      });

    builder
      .addCase('getAllResultFail', (state, action) => {
        state.loadingResult = false;
        state.error = action.payload;
      })
      .addCase('getResultFail', (state, action) => {
        state.loadingResult = false;
        state.error = action.payload;
      })
      .addCase('getAllResultAccordingLocationFail', (state, action) => {
        state.loadingForResultAccordingLocation = false;
        state.error = action.payload;
      })
      .addCase('getNextResultFail', (state, action) => {
        state.loaderForNextResult = false;
        state.error = action.payload;
      });

    builder.addCase('clearError', state => {
      state.error = null;
    });
    builder.addCase('clearMessage', state => {
      state.results = [];
    });
  },
);

import React from 'react';
import Main from './src/navigations';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
    
  );
}




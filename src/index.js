import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });


ReactDOM.render(

    <AuthContextProvider>
      <StylesProvider jss={jss}>
        <App />
      </StylesProvider>
    </AuthContextProvider>
 ,
  document.getElementById('root')
);



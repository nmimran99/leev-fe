import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import './i18n';
import { LanguageContextProvider } from './context/LanguageContext';

ReactDOM.render(
    <LanguageContextProvider>
      <AuthContextProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>   
      </AuthContextProvider>
    </LanguageContextProvider>
      
 ,
  document.getElementById('root')
);



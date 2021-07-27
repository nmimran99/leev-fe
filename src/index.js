import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthContextProvider } from './context/AuthContext'
import './i18n';
import { LanguageContextProvider } from './context/LanguageContext';
import { EnvContextProvider } from './context/EnvContext';
import { LoadingProgress } from './components/reuseables/LoadingProgress';

Object.defineProperty(Array.prototype, "chunk", {
	value: function (chunkSize) {
		var R = [];
		for (var i = 0; i < this.length; i += chunkSize)
			R.push(this.slice(i, i + chunkSize));
		return R;
	},
});

ReactDOM.render(
    <EnvContextProvider>
      <LanguageContextProvider>
        <AuthContextProvider>
          <Suspense fallback={<LoadingProgress initial={true} />}>
            <App />
          </Suspense>   
        </AuthContextProvider>
      </LanguageContextProvider>
    </EnvContextProvider>
      
 ,
  document.getElementById('root')
);



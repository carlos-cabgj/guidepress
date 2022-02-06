import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {IntlProvider} from 'react-intl';

// import lang_en from './i18n/lang/en.json';
import lang_pt_BR from './i18n/lang/pt-BR.json';

const locale = navigator.language;

ReactDOM.render(
  <React.StrictMode>
    <IntlProvider locale ={locale} messages={lang_pt_BR}>
    <App />
    </IntlProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

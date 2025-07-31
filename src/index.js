import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap/dist/js/bootstrap.min.js";
import { Provider } from 'react-redux';
import { store } from './store';


const environment = process.env.NODE_ENV;
const title = environment === 'development' ? 'OLCMS LOCAL' : 'OLCMS DEV';

document.title = title;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);



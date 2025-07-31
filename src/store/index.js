import { useDispatch as useReduxDispatch } from 'react-redux';//useSelector
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

//for storage
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { thunk } from 'redux-thunk';

import Reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
}
//   const Reducers = combineReducers({
//     fieldreducer: FieldsReducer,
//      loginreducer : LoginReducer,
//      modalState : ModalPopupReducer,
// })

const persistedReducer = persistReducer(persistConfig, Reducers)

//
// const store = configureStore({
//   reducer: {
//     reducers: persistedReducer,
//     //middleware:(getDefaultMiddleware)=>getDefaultMiddleware(),
//   },

//   devTools: true,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
//   // devTools: process.env.NODE_ENV !== 'production',
//   //middleware: [thunk]//added
// });
const store = configureStore({
  reducer: {
    reducers: persistedReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values from redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(thunk),
});



export const useDispatch = () => useReduxDispatch();
const persister = persistStore(store);

const { dispatch } = store;


axios.interceptors.request.use(function (config) {
  //console.log("request")
  dispatch({ type: "SHOW_LOADING_SPINNER", payload: true });

  return config;
},
  function (error) {
    dispatch({ type: "HIDE_LOADING_SPINNER", payload: true });
    //if(localStorage.getItem("token")===null || localStorage.getItem("token")===undefined ||  localStorage.getItem("token").length<4){
    //     // window.location.href=LOGIN_PAGE_URL
    //  }
    setTimeout(() => { }, 1500)
    return Promise.reject(error);
  });
axios.interceptors.response.use(function (response) {
  dispatch({ type: "HIDE_LOADING_SPINNER", payload: true });
  return response;
}, function (error) {
  dispatch({ type: "HIDE_LOADING_SPINNER", payload: true });
  //if (localStorage.getItem("token") === null || localStorage.getItem("token") === undefined || localStorage.getItem("token").length < 4) {
  //     // window.location.href=LOGIN_PAGE_URL
  // }
  setTimeout(() => { }, 1500)
  return Promise.reject(error);
})


//persister
export { store, persister };
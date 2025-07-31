
import storage from 'redux-persist/lib/storage';
//import Reducers from '../store/reducers';


const loginInt = { 
   // token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    userLoginDetials:{},
   // tokenTime : null,
      
   // loginDetails: {},
}

function LoginReducer(state = loginInt, action) {
    switch (action.type) {
        case "LOGIN_DETAILS": {
            const { isLoggedIn, user,  userLoginDetials } = action.payload;
            //token,tokenTime
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
               // token,
                user,
                userLoginDetials,
               // tokenTime
            };
        }
        // case "SHOW_LOGIN_DETAILS":
        //     return { ...state, loginDetails: action.payload };
        case "USER_LOGOUT": {
        storage.removeItem('persist:root');
          }
        default:
            return state;
    }
}
export default LoginReducer;

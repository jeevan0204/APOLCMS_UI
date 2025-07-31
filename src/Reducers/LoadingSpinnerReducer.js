const initialSpinnerValues=
{
    showLoadingSpinner:false  
}
export default function LoadingSpinnerReducer(loadingSpinnerValues= initialSpinnerValues, action) {
    switch (action.type) {
      case "SHOW_LOADING_SPINNER": 
        return {...loadingSpinnerValues,showLoadingSpinner:true};

        case "HIDE_LOADING_SPINNER":
            return {...loadingSpinnerValues,showLoadingSpinner:false};

      default:
        return loadingSpinnerValues;
    }
  }
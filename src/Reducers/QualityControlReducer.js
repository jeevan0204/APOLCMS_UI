const initialValues = {
    showQc0Params : {
        showHostelName : '',
        qc0ActionName : ''
    },
    showQc0PendingAction : '',
    showRegionApi : '',

    showQc1Params : {
        showDdoCode : '',
        showActionName : '',
        showHostelName : ''
    },
    showQC1ActionList : '',
    showAswoCode : '',

    showQc2Params : {
        showHostelCode : '',
        showHostelName : '',
        showQc2ActionName: ''
    },
    showQc2PendingAction : '',

    //cr reports ********************************
    showAswoCode1 : 0,
    showCr2DistCode : 0,
    showAswoName : '',
    showCr4DdoCode : '',
    showCrReportList : [],
  };
  
  export function QualityControlReducer(state = initialValues, action) {
    switch (action.type) {
        //Qc0 ****************************************************
        case "SHOW_QC0_PARAMS":
            return { ...state, showQc0Params: action.payload };
        case "SHOW_QC0_PENDING_ACTION":
            return { ...state, showQc0PendingAction: action.payload }; 
        case "SHOW_REGION_API":
            return { ...state, showRegionApi: action.payload };
        //Qc1 ********************************************************
        case "SHOW_QC1_PARAMS":
            return { ...state, showQc1Params: action.payload };
        case "SHOW_QC1_ACTION_LIST":
            return { ...state, showQC1ActionList: action.payload };
        case "SHOW_ASWO_CODE":
            return { ...state, showAswoCode: action.payload };
        //QC2 ********************************************************
        case "SHOW_QC2_PARAMS":
            return { ...state, showQc2Params: action.payload };
        case "SHOW_QC2_PENDING_ACTION":
            return { ...state, showQc2PendingAction: action.payload };
        //CR Reports ********************************************************
        case "SHOW_ASWO_CODE_1":
            return { ...state, showAswoCode1: action.payload };
        case "SHOW_CR2_DISTCODE":
            return { ...state, showCr2DistCode: action.payload };
        case "SHOW_ASWO_NAME":
            return { ...state, showAswoName: action.payload };
        case "SHOW_CR4_DDO_CODE":
            return { ...state, showCr4DdoCode: action.payload };
        case "SHOW_CR_REPORT_LIST":
            return { ...state, showCrReportList: action.payload };
        default:
            return state;
    }
  }
const biometricInitialVaues = {
  showImgLoading: true,
  showImg2Loading: false,
  showbiometricAttendance: '',
  showbiometricSelectedStudent: "",
  showDeviceName: '',
  showStuEkycDetails: {},
  showEKycRowData: [],
  showAddhaardetails: [],
  showStuEkycDetails:false,
  // showEmpFingerImg:
};

export function BiometricReducer(state = biometricInitialVaues, action) {
  switch (action.type) {
    case "SET_IMAGE_LOADING":
      return { ...state, showImgLoading: action.payload };
    case "SET_IMAGETwo_LOADING":
      return { ...state, showImg2Loading: action.payload };
    case "SET_ATTENDANCE_AT_STUBLOCK":
      return { ...state, showbiometricAttendance: action.payload };
    case "SET_SELECTED_STUDENT_AT_STUBLOCK":
      return { ...state, showbiometricSelectedStudent: action.payload };
    case "SET_DEVICE_NAME":
      return { ...state, showDeviceName: action.payload };
    case "SET_STUDENT_EKYC":
      return { ...state, showStuEkycDetails: action.payload };
    case "SET_STUDENT_EKYC_ROW_data":
      return { ...state, showEKycRowData: action.payload };
    case "SET_STUDENT_EKYC_Aadhaar_data":
      return { ...state, showAddhaardetails: action.payload };
      case "SET_EKYC_DETAILS":
        return { ...state, showStuEkycDetails: action.payload };
    default:
      return state;
  }
}
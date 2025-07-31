const FieldsList = {
  CasteList: [],
  SubCasteList: [],
  mandalList: [],
  villageList: [],
  secretariatList: [],
  InstituteList: [],
  InstMandalList: [],
  instListDept33: [],
  formikValues: "",
  modalPopShow: false,
  modalPopShowEdit: false,
};

function AdmissionReducer(state = FieldsList, action) {
  switch (action.type) {
    case "LOG_OUT_CLEAR_DATA":
      return FieldsList;
    case "SHOW_CASTE":
      return { ...state, CasteList: action.payload };
    case "SHOW_SUB_CASTE":
      return { ...state, SubCasteList: action.payload };
    case "MANDALS_LIST":
      return { ...state, mandalList: action.payload };
    case "INSTITUTE_MANDALS_LIST":
      return { ...state, InstMandalList: action.payload };
    case "VILLAGES_LIST":
      return { ...state, villageList: action.payload };
    case "SECRETARIAT_LIST":
      return { ...state, secretariatList: action.payload };
    case "INSTITUTE_LIST":
      return { ...state, InstituteList: action.payload };
    case "FORMIK_VALUES":
      return { ...state, formikValues: action.payload };
    case "MODAL_POP_SHOW":
      return { ...state, modalPopShow: action.payload };
    case "MODAL_POP_SHOW_STU_EDIT":
      return { ...state, modalPopShowEdit: action.payload }
      case "INSTITUTE_DEPT_LIST":
      return { ...state, instListDept33: action.payload }

    default:
      return state;
  }
}

export default AdmissionReducer;

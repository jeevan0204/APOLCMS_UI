const FieldsListInt = {
  districtsList: [],
  vendorsList: [],
  purchasesEdit: "",
  girlStudentsData: [],
  employeeId: '',

  showEmpPersonalDetails: [],
  showEmpAddressDetails: [],
  showEmpPreferenceDetails: [],
  showEmpQualificationDetails: [],
  showEmpEmploymentDetails: [],
  showPurchasesFromTo: [],
  showItemPurchaseDate: '',
  showIndentItems: [],
  showIndentDates: [],

  showIndentInstituteParams: {},
  showItemDashboardItemCode: [],
  showVendorIndentDistParams: {},

  showInvoiceGenParams: {},


  showVendorGenDistParams: {},
  showVendorGenInstDataParams: {},

  showInstituteCategory: [],

  showVendorName: '',
  modalPopPurchasesUpdate: false,

  showstaffTransferparams: {},

}

function FieldsReducer(state = FieldsListInt, action) {
  //console.log('action',action );
  switch (action.type) {
    case "SHOW_DISTRICTS":
      return { ...state, districtsList: action.payload };
    case "SHOW_VENDORS_LIST":
      return { ...state, vendorsList: action.payload };
    case "SHOW_PURCHASES_EDIT":
      return { ...state, purchasesEdit: action.payload };
    case "SHOW_GIRL_STUDENTS_DATA":
      return { ...state, girlStudentsData: action.payload };
    case "SHOW_EMPLOYEE_ID":
      return { ...state, employeeId: action.payload };
    case "SHOW_EMP_PERSONAL_DETAILS":
      return { ...state, showEmpPersonalDetails: action.payload };
    case "SHOW_EMP_ADDRESS_DETAILS":
      return { ...state, showEmpAddressDetails: action.payload };
    case "SHOW_EMP_PREFERENCE_DETAILS":
      return { ...state, showEmpPreferenceDetails: action.payload };
    case "SHOW_EMP_QUALIFICATION_DETAILS":
      return { ...state, showEmpQualificationDetails: action.payload };
    case "SHOW_EMP_EMPLOYMENT_DETAILS":
      return { ...state, showEmpEmploymentDetails: action.payload };
    case "SHOW_PURCHASES_FROM_TO":
      return { ...state, showPurchasesFromTo: action.payload };
    case "SHOW_ITEM_PURCHASE_DATE":
      return { ...state, showItemPurchaseDate: action.payload };
    case "SHOW_INDENT_ITEMS":
      return { ...state, showIndentItems: action.payload };
    case "SHOW_INDENT_DATES":
      return { ...state, showIndentDates: action.payload };
    case "SHOW_INDENT_INSTITUTE_PARAMS":
      return { ...state, showIndentInstituteParams: action.payload };
    case "SHOW_ITEM_DASHBOARD_ITEMCODE":
      return { ...state, showItemDashboardItemCode: action.payload };
    case "SHOW_VENDOR_INDENT_DIST_PARAMS":
      return { ...state, showVendorIndentDistParams: action.payload };
    case "SHOW_INVOICE_GENERATION_PARAMS":
      return { ...state, showInvoiceGenParams: action.payload };
    // case "SHOW_INVOICE_DISTRICTS_PARAMS":
    //   return { ...state, showInvoiceDistricts: action.payload };
    case "SHOW_VENDOR_INDENT_GEN_DIST_PARAMS":
      return { ...state, showVendorGenDistParams: action.payload };
    case "SHOW_VENDOR_INDENT_GEN_INST_DATA_PARAMS":
      return { ...state, showVendorGenInstDataParams: action.payload };

    case "SHOW_INSTITUTES_CATEGORY":
      return { ...state, showInstituteCategory: action.payload };

    case "SHOW_VENDOR_NAME":
      return { ...state, showVendorName: action.payload };

    case "MODAL_POP_PURCHASES_UPDATE":
      return { ...state, modalPopPurchasesUpdate: action.payload }

    case "SHOW_STAFF_TRANSFER_PARAMS":
      return { ...state, showstaffTransferparams: action.payload };
    default:
      return state;
  }
}

export default FieldsReducer;

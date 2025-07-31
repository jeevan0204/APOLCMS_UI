const modalPopupInitialVaues = {
  showEntitlementsPopUp: false,
  showFingerPrintPopup: false,
  showStaffDel: false,
  showEmpFingerPrintPopup: false,
  showProfilePopup: false,
  showStudentMigrateDropoutPopup: false,
  showStudentFingerPrintPopup: false,
};

export function ModalPopupReducer(state = modalPopupInitialVaues, action) {
  switch (action.type) {

    case "SHOW_ENTITLEMENTS_POPUP":
      return { ...state, showEntitlementsPopUp: action.payload };
    case "SHOW_FINGERPRINT_POPUP":
      return { ...state, showFingerPrintPopup: action.payload };
    case "SHOW_STAFF_DELETE_POPUP":
      return { ...state, showStaffDel: action.payload };
    case "SHOW_EMP_FINGERPRINT_POPUP":
      return { ...state, showEmpFingerPrintPopup: action.payload };
    case "SHOW_PROFILE_POPUP":
      return { ...state, showProfilePopup: action.payload };
    case "SHOW_STUDENT_Migrate_Dropout_FINGERPRINT_POPUP":
      return { ...state, showStudentMigrateDropoutPopup: action.payload };
    case "SHOW_STUDENT_FINGERPRINT_POPUP":
      return { ...state, showStudentFingerPrintPopup: action.payload };

    default:
      return state;
  }
}
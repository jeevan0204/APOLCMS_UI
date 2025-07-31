const EntitlementsInt = {
    menuStatus : false,
    studentsDataParams : {},
    // allStudentsData : {},
    // childParams : {},
 }
function EntitlementsReducer(state = EntitlementsInt, action) {
    //console.log('action',action );
    switch (action.type) {
      case "SHOW_MENU_STATUS":       
        return { ...state, menuStatus: action.payload };
    case "SHOW_STUDENTS_DATA_PARAMS":       
        return { ...state, studentsDataParams: action.payload };
    // case "SHOW_ALL_STU_DATA":       
    //     return { ...state, allStudentsData: action.payload };
    // case "SHOW_CHILD_PARAMS":       
    //     return { ...state, childParams: action.payload };
        default:
            return state;
    }
}
    
export default EntitlementsReducer;
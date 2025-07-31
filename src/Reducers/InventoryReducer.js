const InventoryInitialVlues = {
    showActiveStatus: [],
    //showInActiveStatus: [],
    showDeliveryPersonParams: {},
    showVendorsReportParams : {},

    // showActiveCount : 0,
    // showInactiveCount : 0,
    // showReportData
}
function InventoryReducer(state = InventoryInitialVlues, action) {
    //console.log('action',action );
    switch (action.type) {
      case "SHOW_ACTIVE_STATUS":       
        return { ...state, showActiveStatus: action.payload };
    case "SHOW_DELIVERY_PERSON_PARAMS":       
    return { ...state, showDeliveryPersonParams: action.payload };
    case "SHOW_VENDORS_REPORT_PARAMS":       
    return { ...state, showVendorsReportParams: action.payload };
    // case "SHOW_IN_ACTIVE_COUNT":       
    // return { ...state, showInactiveCount: action.payload };

    default:
        return state;
        
    }
}
export default InventoryReducer;
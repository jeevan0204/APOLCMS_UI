import FieldsReducer from '../Reducers/FieldsReducer';
import LoginReducer from '../Reducers/LoginReducer';

import { combineReducers } from "redux";
import { ModalPopupReducer } from '../Reducers/ModalPopUpReducer';
import LoadingSpinnerReducer from '../Reducers/LoadingSpinnerReducer';
import { QualityControlReducer } from '../Reducers/QualityControlReducer';
import InventoryReducer from '../Reducers/InventoryReducer';
import AdmissionReducer from '../Reducers/AdmissionReducer';
import ManPowerReducer from '../Reducers/ManPowerReducer';
import EntitlementsReducer from '../Reducers/EntitlementsReducer';
import { BiometricReducer } from '../Reducers/BiometricReducer';



const Reducers = combineReducers({
    fieldreducer: FieldsReducer,
    loginreducer: LoginReducer,
    modalState: ModalPopupReducer,
    loadingSpinnerReducer: LoadingSpinnerReducer,
    qualityControlReducer: QualityControlReducer,
    inventoryReducer: InventoryReducer,
    admissionreducer: AdmissionReducer,
    manPowerReducer: ManPowerReducer,
    entitlementsReducer: EntitlementsReducer,
    biometricReducer: BiometricReducer

})

export default Reducers;
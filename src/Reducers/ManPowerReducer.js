const FieldsList = {
    modalPopShowManPower: false,
    formikValues: [],
};

export default function ManPowerReducer(state = FieldsList, action) {
    switch (action.type) {
        case "MODAL_POP_MAN_POWER":
            return { ...state, modalPopShowManPower: action.payload };
        case "FORMIK_VALUES_MAN_POWER":
            return { ...state, formikValues: action.payload };

        default:
            return state;
    }
}
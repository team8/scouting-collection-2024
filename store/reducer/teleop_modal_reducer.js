import * as Types from '../types';

const initialState = {
    isTeleopModalOpen: false
};

const teleopModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SET_TELEOP_MODAL:
            return {...state, isTeleopModalOpen: action.payload.isVisible}
        default:
            return state
    }
}

export { teleopModalReducer }
import * as Types from '../types'

const initialState = {
    isMatchesModalOpen: false
}

const matchesModalReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.MATCHES_MODAL:
            return {...state, isMatchesModalOpen: action.payload.isVisible}
        default:
            return state
    }
}

export { matchesModalReducer }
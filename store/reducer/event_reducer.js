import * as Types from '../types';

const initialState = {
    alliance: "",
    matches: [],
    currentMatchData: {},
    currentEvent: "",
    currentSelectedMatch: -1,
    fieldOrientation: 2,
};

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SET_ALLIANCE_COLOR:
            return {...state, alliance: action.payload.color}
        case Types.SET_EVENT:
            return {...state, matches: action.payload.eventData}
        case Types.SET_MATCHES:
            return {...state, matches: action.payload.newMatches}
        case Types.SET_CURRENT_EVENT_KEY:
            return {...state, currentEvent: action.payload.reduxEventKey}
        case Types.SET_CURRENT_MATCH:
            return {...state, currentSelectedMatch: action.payload.selectedMatch}
        case Types.SET_CURRENT_MATCH_DATA:
            // console.log(action.payload.newMatchData)
            return {...state, currentMatchData: action.payload.newMatchData}
        case Types.SET_FIELD_ORIENTATION:
            return {...state, fieldOrientation: action.payload.fieldOrientation}
        default:
            return state
    }
}

export { eventReducer }
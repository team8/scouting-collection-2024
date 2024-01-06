import { combineReducers } from "redux";
import { matchesModalReducer } from "./matches_modal_reducer"
import { eventReducer } from "./event_reducer";
import { teleopModalReducer } from './teleop_modal_reducer';
import { AppRegistry } from 'react-native';

AppRegistry.registerComponent('main', () => App);

export default combineReducers({
    matchesModalReducer,
    eventReducer,
    teleopModalReducer
})
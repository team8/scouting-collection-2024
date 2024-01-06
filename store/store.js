import { configureStore } from "@reduxjs/toolkit";

import rootReducer from './reducer';

export default store = configureStore({ reducer: rootReducer });
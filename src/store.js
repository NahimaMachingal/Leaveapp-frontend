// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import leaveReducer from './features/employee/leaveSlice'

const store = configureStore({
    reducer: {
      auth: authReducer,
      leave: leaveReducer
    }
});

export default store;
import { configureStore } from '@reduxjs/toolkit';
import pointReducer from './slices/pointSlice'

export const store = configureStore({
  reducer:{
    auth: pointReducer,
  }
});

export default store;

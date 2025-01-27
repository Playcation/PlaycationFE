import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  freePoint : 0,
  paidPoint : 0,
}

const pointSlice = createSlice({
  name : 'auth',
  initialState,

  reducers:{
    setPoint(state, action){
      const{freePoint, paidPoint} = action.payload;
      state.freePoint = freePoint;
      state.paidPoint = paidPoint;
    },
  }
})
export const {setPoint} = pointSlice.actions
export default pointSlice.reducer;

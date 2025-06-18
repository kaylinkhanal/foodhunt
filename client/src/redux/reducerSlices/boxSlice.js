import { createSlice } from '@reduxjs/toolkit'
export const boxSlice = createSlice({
  name: 'box',
  initialState: {
    backgroundColor: 'red',
    width: 200,
    height: 200,
    marginLeft:0,
    borderRadius: 0
  },
  reducers: {
    incrementHeight: state => {
      state.height = state.height + 10
    },
    incrementWidth: state => {
      state.width = state.width  + 10
    },
    incrementMarginLeft: state => {
      state.marginLeft = state.marginLeft  + 10
    },
    changeColor: (state, action) => {
      state.backgroundColor = action.payload
    },
    changeToCircle: (state) => {
      state.borderRadius = '100%'
    }
  }
})
export const { incrementHeight, 
  incrementWidth, changeColor,
  incrementMarginLeft,
  changeToCircle } = boxSlice.actions

export default boxSlice.reducer
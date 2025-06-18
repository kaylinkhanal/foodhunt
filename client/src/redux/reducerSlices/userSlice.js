import { createSlice } from '@reduxjs/toolkit'
const intialState ={
  email: '',
  token : '',
  isLoggedIn: false,
  role: '',
  location: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState: intialState,
  reducers: {
    logoutUser: state => {
      return initialState
    },
    addLoginDetails: (state, action) => {
      debugger;
      const {token, isLoggedIn} = action.payload
      const { email,  role, location, _id } = action.payload.user
      return {
        ...state,
        email: email,
        token: token,
        isLoggedIn: isLoggedIn,
        role: role,
        _id: _id,
        location: location
      }
    },
  }
})
export const { logoutUser, addLoginDetails} = userSlice.actions

export default userSlice.reducer
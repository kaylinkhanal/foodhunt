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
      const { email, token, isLoggedIn, role, location } = action.payload
      return {
        ...state,
        email: email,
        token: token,
        isLoggedIn: isLoggedIn,
        role: role,
        location: location
      }
    },
  }
})
export const { logoutUser, addLoginDetails} = userSlice.actions

export default userSlice.reducer
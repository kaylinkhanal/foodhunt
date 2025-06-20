import { configureStore } from '@reduxjs/toolkit'
import  counterSlice  from './reducerSlices/counterSlice'
import  boxSlice  from './reducerSlices/boxSlice'
import  userSlice  from './reducerSlices/userSlice'
import reduxLogger from 'redux-logger'

export default configureStore({
  reducer: {
    counter: counterSlice,
    box: boxSlice,
    user: userSlice
  },
  middleware: ()=> [reduxLogger]
})
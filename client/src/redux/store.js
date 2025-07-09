import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import counterSlice from "./reducerSlices/counterSlice";
import boxSlice from "./reducerSlices/boxSlice";
import userSlice from "./reducerSlices/userSlice";
import reduxLogger from "redux-logger";
import productSlice from "./reducerSlices/productSlice";

const rootReducer = combineReducers({
  counter: counterSlice,
  box: boxSlice,
  user: userSlice,
  product: productSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: () => [reduxLogger],
});

export const persistor = persistStore(store);

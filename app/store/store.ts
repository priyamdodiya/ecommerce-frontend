import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import registerReducer from "./slices/registerSlice";
import {persistStore, persistReducer} from "redux-persist"
import  storage  from "redux-persist/lib/storage";
import productReducer from "./slices/productSlice";
const rootReducer = combineReducers({
  login : loginReducer,
  register : registerReducer,
  product: productReducer,
});

const peristConfig = {
  key : "root",
  storage,
  whitelist : ["login"]
}

const persistedReducer = persistReducer(peristConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck : false,
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

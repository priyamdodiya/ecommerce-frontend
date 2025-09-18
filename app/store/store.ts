import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import registerReducer from "./slices/registerSlice";
import {persistStore, persistReducer} from "redux-persist"
import  storage  from "redux-persist/lib/storage";
import productReducer from "./slices/admin/productSlice";
import userProductReducer from "./slices/user/productSlice";
import singleProductReducer from "./slices/user/singleProductSlice";
import cartReducer from "./slices/user/cartSlice";
import checkoutReducer from "./slices/user/checkoutSlice";
const rootReducer = combineReducers({
  login : loginReducer,
  register : registerReducer,
  product: productReducer,
  userProduct: userProductReducer,
  singleProduct: singleProductReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

const peristConfig = {
  key : "root",
  storage,
  whitelist : ["login","cart"]
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
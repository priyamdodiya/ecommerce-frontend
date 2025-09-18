import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface CheckoutProduct {
  name: string;
  image: string | null;
}

export interface CheckoutCartItem {
  product: CheckoutProduct;
  price: number;
  quantity: number;
}

export interface OrderSummary {
  subTotal: number;
  discount: number;
  total: number;
}

export interface CheckoutPayload {
  cartItems: CheckoutCartItem[];
  orderSummary: OrderSummary;
}

export interface CheckoutResponse {
  id: string;
  url: string;
}

export interface CheckoutState {
  loading: boolean;
  error: string | null;
  session: CheckoutResponse | null;
}

const initialState: CheckoutState = {
  loading: false,
  error: null,
  session: null,
};

export const createCheckoutSession = createAsyncThunk<
  CheckoutResponse,
  CheckoutPayload,
  { rejectValue: string }
>("checkout/createCheckoutSession", async (payload, thunkAPI) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payment/checkout`,
      payload,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data as CheckoutResponse;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Checkout failed"
    );
  }
});

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    resetCheckout: (state) => {
      state.loading = false;
      state.error = null;
      state.session = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.session = null;
      })
      .addCase(
        createCheckoutSession.fulfilled,
        (state, action: PayloadAction<CheckoutResponse>) => {
          state.loading = false;
          state.session = action.payload;
        }
      )
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;

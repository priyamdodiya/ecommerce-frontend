import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "@/app/store/store";
import Cookies from "js-cookie";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;  
  discountPrice: string;
  image: string;
  stock: number;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product; 
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};
export const getCartItems = createAsyncThunk<CartItem[],void,{rejectValue : string}>("cart/getCartItems", async (_,{rejectWithValue}) => {
  try{
    const token  = Cookies.get("token");
        const res = await axios.get<CartItem[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/carts`,{headers : {Authorization : `Bearer ${token}`},})

    return res.data
  }catch(err){
    const error = err as AxiosError<{message : string}>;
    return rejectWithValue(error.response?.data?.message || "failed to fetch cart Items");
  } 
})


export const addToCart = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number },
  { rejectValue: string }
>("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("token");
    const res = await axios.post<CartItem>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/carts`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
  }
});

export const updateCartQuantity = createAsyncThunk<CartItem, { cartId: number; quantity: number }, { rejectValue: string }>("cart/updateCartQuantity", async ({ cartId, quantity }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("token");
    const res = await axios.put<CartItem>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/carts/${cartId}`, { quantity }, { headers: { Authorization: `Bearer ${token}` }, });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
  }
});

export const deleteCartItem = createAsyncThunk<
  number,
  { cartId: number },
  { rejectValue: string }
>("cart/deleteCartItem", async ({ cartId }, { rejectWithValue }) => {
  try {
    const token = Cookies.get("token");
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/carts/${cartId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ deleteCartItem response:", res.data);
    return cartId;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    console.error("deleteCartItem error:", error.response?.data || error.message);
    return rejectWithValue(error.response?.data?.message || "Failed to delete item");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

    builder
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex((i) => i.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })

      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"
      })
  },
});

export default cartSlice.reducer;
export const { clearCart } = cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
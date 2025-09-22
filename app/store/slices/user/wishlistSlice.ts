import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { Product } from "./productSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface WishlistItem {
  id: number;
  productId: number;
  userId: number;
  product: Product;
  image?: string;
  name: string;
  category?: string;
price: number;
discountPrice?: number;
isAvailable: boolean;
discount? : number;
stock? : number;
description? : string
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk<WishlistItem[], void, { state: RootState }>(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<WishlistItem[]>(`${API_BASE_URL}/wishlist`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);



export const addToWishlist = createAsyncThunk<WishlistItem, number, { state: RootState }>(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.post<WishlistItem>(
        `${API_BASE_URL}/wishlist`,
        { productId },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to add product to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk<number, number, { state: RootState }>(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/wishlist/${productId}`, {
        withCredentials: true,
      });
      return productId;
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Failed to remove product from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem>) => {
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.productId !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});
export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

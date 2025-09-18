import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: string;
  stock: number;
  image: string;
  status?: string;
  discount?: number; 
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  loading: boolean;
  error: string | null;
  products: Product[];
}

const initialState: ProductState = {
  loading: false,
  error: null,
  products: [],
};

export const getProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("user/product/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ total: number; data: Product[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`
    );
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

export const getProductsByCategory = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("user/product/getByCategory", async (category, { rejectWithValue }) => {
  try {
    const response = await axios.get<{ total: number; data: Product[] }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?category=${category}`
    );
    return response.data.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
});

const userProductSlice = createSlice({
  name: "userProduct",
  initialState,
  reducers: {
    resetUserProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error";
      });

      builder
      .addCase(getProductsByCategory.pending,(state)=>{
        state.loading = true;
      })
      .addCase(getProductsByCategory.fulfilled,(state,action)=>{
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload ?? "Unknown error"
      })
  },
});

export const { resetUserProductState } = userProductSlice.actions;
export default userProductSlice.reducer;
